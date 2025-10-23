import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Badge } from '@pariconnect/ui';

interface Plan {
  id: string;
  code: string;
  priceInr: number;
  visitsPerMonth: number;
  features: string[];
}

interface Subscription {
  id: string;
  status: string;
  plan: Plan | null;
  provider: string;
  currentPeriodEnd?: string;
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  useEffect(() => {
    const load = async () => {
      const [plansRes, subscriptionRes] = await Promise.all([
        axios.get(`${API_URL}/api/plans`),
        axios.get(`${API_URL}/api/subscription/me`)
      ]);
      setPlans(plansRes.data.plans ?? []);
      setSubscription(subscriptionRes.data.subscription ?? null);
    };
    load().catch(() => setMessage('Unable to load subscription data.'));
  }, [API_URL]);

  const handleSubscribe = async (planId: string) => {
    try {
      await axios.post(`${API_URL}/api/subscribe`, {
        planId,
        provider: 'stripe'
      });
      setMessage('Subscription flow initiated. Complete the checkout in the popup.');
    } catch (err) {
      setMessage('Could not start checkout session.');
    }
  };

  return (
    <div className="main-layout">
      <Head>
        <title>Subscriptions • PariConnect</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold text-charcoal">
            ← Back to dashboard
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
          <div>
            <h1 className="text-3xl font-semibold text-charcoal">Subscriptions</h1>
            <p className="text-sm text-charcoal/70">Flexible plans with Razorpay or Stripe payments.</p>
          </div>
          {message && <Card className="p-4 text-sm text-charcoal/80">{message}</Card>}
          {subscription?.plan && (
            <Card className="border border-teal bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-charcoal">Current plan: {subscription.plan.code}</h2>
              <p className="text-sm text-charcoal/70">Status: {subscription.status}</p>
              {subscription.currentPeriodEnd && (
                <p className="text-sm text-charcoal/70">
                  Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
              <Badge className="mt-4 w-fit" variant="accent">
                Billing via {subscription.provider}
              </Badge>
            </Card>
          )}
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className="bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-charcoal capitalize">{plan.code}</h3>
                <p className="text-3xl font-bold text-teal">₹{plan.priceInr}</p>
                <p className="text-sm text-charcoal/70">{plan.visitsPerMonth} visit(s) / month</p>
                <ul className="mt-4 space-y-2 text-sm text-charcoal/80">
                  {plan.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" onClick={() => handleSubscribe(plan.id)}>
                  Choose plan
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
