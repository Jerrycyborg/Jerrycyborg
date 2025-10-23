import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@pariconnect/db';
import type { AuthenticatedRequest } from '../middleware/auth';
import { audit } from '../middleware/audit';

const router = Router();

const startVisitSchema = z.object({
  selfieUrl: z.string().url(),
  geo: z.string().min(5)
});

router.post('/visit/:id/start', async (req: AuthenticatedRequest, res, next) => {
  try {
    const payload = startVisitSchema.parse(req.body);
    const visit = await prisma.visit.update({
      where: { id: req.params.id },
      data: {
        status: 'in_progress',
        startAt: new Date(),
        startSelfie: payload.selfieUrl,
        startGeo: payload.geo
      }
    });
    await audit('visit:start', req, { visitId: visit.id });
    res.json({ visit });
  } catch (error) {
    next(error);
  }
});

const completeVisitSchema = z.object({
  selfieUrl: z.string().url(),
  geo: z.string().min(5),
  notes: z.string().optional(),
  photos: z.array(z.string().url()).max(2).optional(),
  consentPhoto: z.boolean().default(false)
});

router.post('/visit/:id/complete', async (req: AuthenticatedRequest, res, next) => {
  try {
    const payload = completeVisitSchema.parse(req.body);
    if (!payload.consentPhoto) {
      return res.status(400).json({ message: 'Consent is required to complete the visit.' });
    }
    const visit = await prisma.visit.update({
      where: { id: req.params.id },
      data: {
        status: 'completed',
        endAt: new Date(),
        endSelfie: payload.selfieUrl,
        endGeo: payload.geo,
        consentPhoto: payload.consentPhoto,
        photos: payload.photos,
        notes: payload.notes
      }
    });
    await audit('visit:complete', req, { visitId: visit.id });
    res.json({ visit });
  } catch (error) {
    next(error);
  }
});

export default router;
