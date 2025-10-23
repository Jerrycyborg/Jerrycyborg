import type { PaymentsAdapter, CheckoutInput } from './adapter';
import type { Request } from 'express';

export const stripeAdapter: PaymentsAdapter = {
  async createCheckoutSession(input: CheckoutInput) {
    return {
      id: `cs_test_${Date.now()}`,
      url: `https://checkout.stripe.com/test/session?amount=${input.amount}`
    };
  },
  async handleWebhook(_req: Request) {
    return { type: 'stripe.test', data: {} };
  },
  async refundPayment(_payment) {
    return;
  }
};
