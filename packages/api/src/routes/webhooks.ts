import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@pariconnect/db';

const router = Router();

const whatsappSchema = z.object({
  from: z.string(),
  text: z.string()
});

router.post('/webhooks/wa', async (req, res, next) => {
  try {
    const payload = whatsappSchema.parse(req.body);
    const parent = await prisma.parent.findFirst();
    if (!parent) {
      return res.json({ status: 'ignored' });
    }
    const normalizedText = payload.text.trim().toLowerCase();
    if (normalizedText.includes('sos') || normalizedText.includes('🚨')) {
      await prisma.alert.create({ data: { parentId: parent.id, type: 'sos', message: `WhatsApp SOS from ${payload.from}` } });
    } else {
      const mood = normalizedText.includes('ok') || normalizedText.includes('🙂') ? 'ok' : 'happy';
      await prisma.checkIn.create({ data: { parentId: parent.id, mood, note: `WhatsApp message: ${payload.text}` } });
    }
    res.json({ status: 'processed' });
  } catch (error) {
    next(error);
  }
});

export default router;
