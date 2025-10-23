import Head from 'next/head';
import Link from 'next/link';
import { Card } from '@pariconnect/ui';

export default function PrivacyPage() {
  return (
    <div className="main-layout">
      <Head>
        <title>Privacy • PariConnect</title>
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
          <h1 className="text-3xl font-semibold text-charcoal">Privacy Policy</h1>
          <Card className="space-y-4 bg-white p-6 shadow-sm">
            <p className="text-sm text-charcoal/80">
              PariConnect operates as a family-centric wellbeing platform. We store check-ins, visit proofs, and caregiver notes in
              secure infrastructure. Voice notes and photos are stored in encrypted storage with consent controls.
            </p>
            <p className="text-sm text-charcoal/80">
              We never sell personal data. Data is retained for operational purposes and deleted upon request at
              privacy@pariconnect.in.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
