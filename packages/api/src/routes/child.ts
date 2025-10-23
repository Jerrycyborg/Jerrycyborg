import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@pariconnect/db';
import { streamMonthlyReport } from '../utils/pdf';
import type { AuthenticatedRequest } from '../middleware/auth';
import { audit } from '../middleware/audit';
import { getPaymentsAdapter } from '../payments/adapter';

const router = Router();

router.get('/plans', async (_req, res, next) => {
  try {
    const plans = await prisma.plan.findMany();
    res.json({
      plans: plans.map((plan) => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features : []
      }))
    });
  } catch (error) {
    next(error);
  }
});

router.get('/subscription/me', async (req: AuthenticatedRequest, res, next) => {
  try {
    const childId = req.user?.id ?? (await prisma.user.findFirst({ where: { role: 'CHILD' } }))?.id;
    if (!childId) {
      return res.json({ subscription: null });
    }
    const subscription = await prisma.subscription.findFirst({
      where: { childId },
      include: { plan: true }
    });
    if (!subscription) {
      return res.json({ subscription: null });
    }
    res.json({
      subscription: {
        ...subscription,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString(),
        plan: subscription.plan
          ? {
              ...subscription.plan,
              features: Array.isArray(subscription.plan.features) ? subscription.plan.features : []
            }
          : null
      }
    });
  } catch (error) {
    next(error);
  }
});

const visitSchema = z.object({
  parentId: z.string().min(1),
  type: z.string().default('companion'),
  scheduledAt: z.string().min(1),
  notes: z.string().optional()
});

router.post('/visit', async (req: AuthenticatedRequest, res, next) => {
  try {
    const payload = visitSchema.parse(req.body);
    const visit = await prisma.visit.create({
      data: {
        parentId: payload.parentId,
        type: payload.type,
        status: 'scheduled',
        scheduledAt: new Date(payload.scheduledAt),
        notes: payload.notes
      }
    });
    await audit('visit:create', req, { visitId: visit.id });
    res.status(201).json({ visit });
  } catch (error) {
    next(error);
  }
});

router.get('/visits', async (req, res, next) => {
  try {
    const me = req.query.me as string | undefined;
    if (me === 'today') {
      const caregiver = await prisma.caregiver.findFirst();
      if (!caregiver) {
        return res.json({ visits: [] });
      }
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      const visits = await prisma.visit.findMany({
        where: {
          caregiverId: caregiver.id,
          scheduledAt: { gte: todayStart, lte: todayEnd }
        },
        include: { parent: true },
        orderBy: { scheduledAt: 'asc' }
      });
      return res.json({
        visits: visits.map((visit) => ({
          id: visit.id,
          parentName: visit.parent.name,
          scheduledAt: visit.scheduledAt.toISOString(),
          status: visit.status,
          type: visit.type,
          consentPhoto: visit.consentPhoto
        }))
      });
    }

    const visits = await prisma.visit.findMany({
      include: {
        parent: true,
        caregiver: true
      },
      orderBy: { scheduledAt: 'desc' },
      take: 20
    });
    res.json({
      visits: visits.map((visit) => ({
        id: visit.id,
        parentName: visit.parent.name,
        caregiverName: visit.caregiver?.fullName,
        scheduledAt: visit.scheduledAt.toISOString(),
        status: visit.status,
        type: visit.type,
        consentPhoto: visit.consentPhoto
      }))
    });
  } catch (error) {
    next(error);
  }
});

const subscribeSchema = z.object({
  planId: z.string(),
  provider: z.enum(['stripe', 'razorpay'])
});

router.post('/subscribe', async (req: AuthenticatedRequest, res, next) => {
  try {
    const payload = subscribeSchema.parse(req.body);
    const childId = req.user?.id ?? (await prisma.user.findFirst({ where: { role: 'CHILD' } }))?.id;
    const parentLink = childId
      ? await prisma.parentChild.findFirst({ where: { childId }, include: { parent: true } })
      : null;
    const parent = parentLink?.parent;
    if (!childId || !parent) {
      return res.status(400).json({ message: 'Missing linked family account' });
    }

    const plan = await prisma.plan.findUnique({ where: { id: payload.planId } });
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const subscriptionRecord = await prisma.subscription.upsert({
      where: { id: `sub-${childId}-${parent.id}` },
      update: {
        planId: plan.id,
        status: 'active',
        paymentProvider: payload.provider
      },
      create: {
        id: `sub-${childId}-${parent.id}`,
        childId,
        parentId: parent.id,
        planId: plan.id,
        status: 'active',
        paymentProvider: payload.provider
      }
    });

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionRecord.id },
      include: { plan: true }
    });

    if (!subscription) {
      return res.status(500).json({ message: 'Unable to load subscription' });
    }

    const adapter = getPaymentsAdapter(payload.provider);
    const session = await adapter.createCheckoutSession({
      amount: plan.priceInr,
      currency: 'INR',
      customerId: childId
    });

    await audit('subscription:checkout', req, { subscriptionId: subscription.id, provider: payload.provider });

    res.json({
      subscription: {
        ...subscription,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString(),
        plan: subscription.plan
          ? {
              ...subscription.plan,
              features: Array.isArray(subscription.plan.features) ? subscription.plan.features : []
            }
          : null
      },
      checkout: session
    });
  } catch (error) {
    next(error);
  }
});

router.get('/report/:parentId/monthly.pdf', async (req, res, next) => {
  try {
    const parent = await prisma.parent.findUnique({ where: { id: req.params.parentId } });
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
    const [visits, checkIns] = await Promise.all([
      prisma.visit.findMany({ where: { parentId: parent.id, scheduledAt: { gte: since } }, include: { caregiver: true } }),
      prisma.checkIn.findMany({ where: { parentId: parent.id, createdAt: { gte: since } } })
    ]);

    streamMonthlyReport(res, {
      parentName: parent.name,
      monthLabel: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      summaries: [
        { title: 'Check-ins', value: String(checkIns.length) },
        { title: 'Visits', value: String(visits.length) }
      ],
      visits: visits.map((visit) => ({
        scheduledAt: visit.scheduledAt.toISOString(),
        status: visit.status,
        caregiver: visit.caregiver?.fullName
      })),
      checkIns: checkIns.map((checkIn) => ({
        createdAt: checkIn.createdAt.toISOString(),
        mood: checkIn.mood,
        note: checkIn.note
      }))
    });
  } catch (error) {
    next(error);
  }
});

export default router;
