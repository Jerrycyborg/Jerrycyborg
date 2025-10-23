import type { Request } from 'express';
import { stripeAdapter } from './stripe';
import { razorpayAdapter } from './razorpay';
import { config } from '../config';

export interface CheckoutInput {
  amount: number;
  currency: string;
  customerId: string;
}

export interface PaymentsAdapter {
  createCheckoutSession(input: CheckoutInput): Promise<{ id: string; url: string }>;
  handleWebhook?(req: Request): Promise<{ type: string; data: unknown }>;
  refundPayment?(payment: { providerRef?: string | null }): Promise<void>;
}

export function getPaymentsAdapter(provider: 'stripe' | 'razorpay' = config.paymentsProvider as 'stripe' | 'razorpay'): PaymentsAdapter {
  return provider === 'razorpay' ? razorpayAdapter : stripeAdapter;
}
