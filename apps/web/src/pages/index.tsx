import Head from 'next/head';
import Link from 'next/link';
import { Button, Card } from '@pariconnect/ui';

export default function HomePage() {
  return (
    <div className="main-layout">
      <Head>
        <title>PariConnect</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <span className="text-2xl font-semibold text-charcoal">PariConnect</span>
          <div className="space-x-4">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/care">Caregiver</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-ivory py-16">
          <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
            <h1 className="text-4xl font-bold text-charcoal">Stay close to your parents from anywhere</h1>
            <p className="text-lg text-charcoal/80">
              Daily mood check-ins, trusted caregiver visits, and actionable alerts in a single, local-first experience.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/dashboard">Launch dashboard</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/care">Caregiver sign-in</Link>
              </Button>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-6 py-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Real-time wellbeing',
              description: 'See daily check-ins, voice notes, and SOS alerts from parents in Tamil or English.'
            },
            {
              title: 'Trusted caregivers',
              description: 'Assign vetted caregivers, track visit proofs, and capture consent-aware photos.'
            },
            {
              title: 'Global payments',
              description: 'Pay via Razorpay or Stripe, with proration, invoices, and automated retries.'
            }
          ].map((feature) => (
            <Card key={feature.title} className="h-full bg-white shadow-sm">
              <div className="space-y-2 p-6">
                <h3 className="text-xl font-semibold text-charcoal">{feature.title}</h3>
                <p className="text-charcoal/80">{feature.description}</p>
              </div>
            </Card>
          ))}
        </section>
      </main>
      <footer className="bg-charcoal text-ivory py-6 text-center text-sm space-y-2">
        <div className="space-x-4">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
        <p>© {new Date().getFullYear()} PariConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}
