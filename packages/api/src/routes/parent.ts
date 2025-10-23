import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@pariconnect/db';
import type { ParentTimelineEntry } from '@pariconnect/types';
import { audit } from '../middleware/audit';
import type { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const checkInSchema = z.object({
  parentId: z.string().min(1),
  mood: z.enum(['happy', 'ok', 'sad']),
  note: z.string().max(500).optional(),
  voiceUrl: z.string().min(1).optional()
});

router.post('/checkin', async (req: AuthenticatedRequest, res, next) => {
  try {
    const payload = checkInSchema.parse(req.body);
    const checkIn = await prisma.checkIn.create({
      data: {
        parentId: payload.parentId,
        mood: payload.mood,
        note: payload.note,
        voiceUrl: payload.voiceUrl
      }
    });
    await audit('checkin:create', req, { parentId: payload.parentId, mood: payload.mood });
    res.status(201).json({ checkIn });
  } catch (error) {
    next(error);
  }
});

const sosSchema = z.object({
  parentId: z.string().min(1),
  message: z.string().optional()
});

router.post('/alert/sos', async (req: AuthenticatedRequest, res, next) => {
  try {
    const payload = sosSchema.parse(req.body);
    const alert = await prisma.alert.create({
      data: {
        parentId: payload.parentId,
        type: 'sos',
        message: payload.message ?? 'SOS triggered from mobile app'
      }
    });
    await audit('alert:sos', req, { parentId: payload.parentId });
    res.status(201).json({ alert });
  } catch (error) {
    next(error);
  }
});

router.get('/parent/:id/summary', async (req, res, next) => {
  try {
    const parentId = req.params.id;
    const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);

    const [parent, checkIns, visits, alerts] = await Promise.all([
      prisma.parent.findUnique({ where: { id: parentId }, include: { user: true } }),
      prisma.checkIn.findMany({ where: { parentId, createdAt: { gte: since } }, orderBy: { createdAt: 'desc' } }),
      prisma.visit.findMany({ where: { parentId, scheduledAt: { gte: since } }, orderBy: { scheduledAt: 'desc' } }),
      prisma.alert.findMany({ where: { parentId, createdAt: { gte: since } }, orderBy: { createdAt: 'desc' } })
    ]);

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    const timeline: ParentTimelineEntry[] = [
      ...checkIns.map((item) => ({
        type: 'checkin' as const,
        timestamp: item.createdAt.toISOString(),
        data: { mood: item.mood, note: item.note, voiceUrl: item.voiceUrl }
      })),
      ...visits.map((item) => ({
        type: 'visit' as const,
        timestamp: item.scheduledAt.toISOString(),
        data: { status: item.status, type: item.type }
      })),
      ...alerts.map((item) => ({
        type: 'alert' as const,
        timestamp: item.createdAt.toISOString(),
        data: { type: item.type, message: item.message }
      }))
    ].sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));

    res.json({
      parent: {
        id: parent.id,
        name: parent.name,
        language: parent.language,
        timeline
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/parent/mock-child/summary', async (_req, res, next) => {
  try {
    const parents = await prisma.parent.findMany({ take: 3 });
    const summaries = await Promise.all(
      parents.map(async (parent) => {
        const summary = await prisma.checkIn.findMany({
          where: { parentId: parent.id },
          orderBy: { createdAt: 'desc' },
          take: 10
        });
        return {
          parentId: parent.id,
          name: parent.name,
          language: parent.language,
          timeline: summary.map((item) => ({
            type: 'checkin' as const,
            timestamp: item.createdAt.toISOString(),
            data: { mood: item.mood, note: item.note }
          }))
        };
      })
    );
    res.json({ parents: summaries });
  } catch (error) {
    next(error);
  }
});

router.get('/parent/mock-parent/history', async (_req, res, next) => {
  try {
    const parent = await prisma.parent.findFirst();
    if (!parent) {
      return res.json({ entries: [] });
    }
    const [checkIns, visits, alerts] = await Promise.all([
      prisma.checkIn.findMany({ where: { parentId: parent.id }, orderBy: { createdAt: 'desc' }, take: 20 }),
      prisma.visit.findMany({ where: { parentId: parent.id }, orderBy: { scheduledAt: 'desc' }, take: 20 }),
      prisma.alert.findMany({ where: { parentId: parent.id }, orderBy: { createdAt: 'desc' }, take: 10 })
    ]);

    const entries = [
      ...checkIns.map((item) => ({ id: item.id, type: 'checkin', mood: item.mood, createdAt: item.createdAt })),
      ...visits.map((item) => ({ id: item.id, type: 'visit', status: item.status, createdAt: item.scheduledAt })),
      ...alerts.map((item) => ({ id: item.id, type: 'alert', createdAt: item.createdAt }))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    res.json({ entries: entries.map((entry) => ({ ...entry, createdAt: entry.createdAt.toISOString() })) });
  } catch (error) {
    next(error);
  }
});

export default router;
