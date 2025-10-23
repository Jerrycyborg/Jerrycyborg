import Head from 'next/head';
import Link from 'next/link';
import { Card } from '@pariconnect/ui';

export default function TermsPage() {
  return (
    <div className="main-layout">
      <Head>
        <title>Terms • PariConnect</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-charcoal">
            ← Back to home
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
          <h1 className="text-3xl font-semibold text-charcoal">Terms of Service</h1>
          <Card className="space-y-4 bg-white p-6 shadow-sm">
            <p className="text-sm text-charcoal/80">
              PariConnect provides wellbeing monitoring and caregiver coordination. By using the service you agree to receive
              wellbeing alerts, visit confirmations, and payment notifications via email, SMS, and WhatsApp.
            </p>
            <p className="text-sm text-charcoal/80">
              Caregivers agree to capture verified proofs (selfies, geolocation, consent) for each visit. Families may cancel
              subscriptions anytime via the dashboard, with pro-rated refunds according to the selected payment provider.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
