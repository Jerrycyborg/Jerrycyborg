import { Router } from 'express';
import { z } from 'zod';
import { prisma, Role } from '@pariconnect/db';
import { audit } from '../middleware/audit';
import type { AuthenticatedRequest } from '../middleware/auth';
import { getPaymentsAdapter } from '../payments/adapter';

const router = Router();

router.get('/dashboard', async (_req, res, next) => {
  try {
    const [alerts, visits, payments] = await Promise.all([
      prisma.alert.findMany({ where: { resolved: false }, include: { parent: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.visit.findMany({ include: { caregiver: true, parent: true }, orderBy: { scheduledAt: 'desc' }, take: 5 }),
      prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
    ]);

    const kpis = [
      { label: 'Active parents', value: String(await prisma.parent.count()) },
      { label: 'Caregiver roster', value: String(await prisma.caregiver.count()) },
      { label: 'Monthly revenue', value: `₹${payments.reduce((sum, payment) => sum + payment.amountInr, 0)}` }
    ];

    res.json({
      kpis,
      alerts: alerts.map((alert) => ({
        id: alert.id,
        parentName: alert.parent.name,
        type: alert.type,
        createdAt: alert.createdAt.toISOString()
      })),
      payoutsDue: visits
        .filter((visit) => visit.status === 'completed')
        .map((visit) => ({ caregiver: visit.caregiver?.fullName ?? 'Unassigned', amount: 800 }))
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

const createUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['CHILD', 'PARENT', 'CAREGIVER', 'ADMIN'])
});

router.post('/users', async (req: AuthenticatedRequest, res, next) => {
  try {
    const payload = createUserSchema.parse(req.body);
    const user = await prisma.user.upsert({
      where: { email: payload.email },
      update: { role: payload.role as Role },
      create: { email: payload.email, role: payload.role as Role }
    });
    await audit('admin:user_invite', req, { userId: user.id, role: payload.role });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

router.get('/visits', async (_req, res, next) => {
  try {
    const visits = await prisma.visit.findMany({ include: { caregiver: true, parent: true }, take: 50 });
    res.json({
      visits: visits.map((visit) => ({
        id: visit.id,
        parentName: visit.parent.name,
        caregiverName: visit.caregiver?.fullName,
        status: visit.status,
        scheduledAt: visit.scheduledAt.toISOString()
      }))
    });
  } catch (error) {
    next(error);
  }
});

router.get('/finance', async (_req, res, next) => {
  try {
    const [payments, refunds] = await Promise.all([
      prisma.payment.findMany({ where: { status: 'succeeded' } }),
      prisma.payment.findMany({ where: { status: 'refunded' } })
    ]);
    const payouts = await prisma.visit.count({ where: { status: 'completed' } });
    res.json({
      revenue: payments.reduce((sum, payment) => sum + payment.amountInr, 0),
      refunds: refunds.reduce((sum, payment) => sum + payment.amountInr, 0),
      payouts: payouts * 800,
      breakdown: [
        { label: 'Stripe', amount: payments.filter((p) => p.provider === 'stripe').reduce((s, p) => s + p.amountInr, 0) },
        { label: 'Razorpay', amount: payments.filter((p) => p.provider === 'razorpay').reduce((s, p) => s + p.amountInr, 0) }
      ]
    });
  } catch (error) {
    next(error);
  }
});

router.get('/community', async (_req, res, next) => {
  try {
    const posts = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
    const feedback = await prisma.feedback.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { child: true } });
    res.json({
      posts: posts.map((post) => ({
        id: post.id,
        title: post.action,
        body: JSON.stringify(post.metadata ?? {}),
        status: 'published',
        createdAt: post.createdAt.toISOString()
      })),
      feedback: feedback.map((item) => ({
        id: item.id,
        from: item.child.email ?? 'family@pariconnect',
        label: item.comments?.includes('safety') ? 'safety' : 'ops',
        message: item.comments ?? ''
      }))
    });
  } catch (error) {
    next(error);
  }
});

const announcementSchema = z.object({ body: z.string().min(3) });

router.post('/community', async (req: AuthenticatedRequest, res, next) => {
  try {
    const payload = announcementSchema.parse(req.body);
    await audit('community:announcement', req, { body: payload.body });
    res.status(201).json({ status: 'queued' });
  } catch (error) {
    next(error);
  }
});

const assignSchema = z.object({ visitId: z.string(), caregiverId: z.string() });

router.post('/assign', async (req: AuthenticatedRequest, res, next) => {
  try {
    const payload = assignSchema.parse(req.body);
    const visit = await prisma.visit.update({
      where: { id: payload.visitId },
      data: { caregiverId: payload.caregiverId }
    });
    await audit('visit:assign', req, { visitId: visit.id, caregiverId: payload.caregiverId });
    res.json({ visit });
  } catch (error) {
    next(error);
  }
});

const refundSchema = z.object({ paymentId: z.string() });

router.post('/refund', async (req: AuthenticatedRequest, res, next) => {
  try {
    const payload = refundSchema.parse(req.body);
    const payment = await prisma.payment.findUnique({ where: { id: payload.paymentId } });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    const adapter = getPaymentsAdapter(payment.provider as 'stripe' | 'razorpay');
    await adapter.refundPayment?.(payment);
    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'refunded' }
    });
    await audit('payment:refund', req, { paymentId: payment.id });
    res.json({ payment: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
