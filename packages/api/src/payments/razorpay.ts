import type { PaymentsAdapter, CheckoutInput } from './adapter';
import type { Request } from 'express';

export const razorpayAdapter: PaymentsAdapter = {
  async createCheckoutSession(input: CheckoutInput) {
    return {
      id: `rzp_order_${Date.now()}`,
      url: `https://razorpay.com/checkout?amount=${input.amount}`
    };
  },
  async handleWebhook(_req: Request) {
    return { type: 'razorpay.test', data: {} };
  },
  async refundPayment(_payment) {
    return;
  }
};
