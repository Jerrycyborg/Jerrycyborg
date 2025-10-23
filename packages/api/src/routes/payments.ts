import { Router } from 'express';
import { getPaymentsAdapter } from '../payments/adapter';

const router = Router();

router.post('/payments/webhook/:provider', async (req, res, next) => {
  try {
    const provider = req.params.provider as 'stripe' | 'razorpay';
    const adapter = getPaymentsAdapter(provider);
    const event = await adapter.handleWebhook?.(req);
    res.json({ received: true, event });
  } catch (error) {
    next(error);
  }
});

export default router;
