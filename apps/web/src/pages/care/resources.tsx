import Head from 'next/head';
import Link from 'next/link';
import { Card } from '@pariconnect/ui';

const resources = [
  {
    title: 'Visit checklist',
    description: 'Steps to follow before, during, and after each visit to ensure consistency and quality.'
  },
  {
    title: 'Consent policy',
    description: 'Understand how to capture photo consent in Tamil and English using the PariConnect app.'
  },
  {
    title: 'Incident reporting',
    description: 'Guidelines for flagging late/no-show scenarios and requesting supervisor support.'
  }
];

export default function CareResourcesPage() {
  return (
    <div className="main-layout">
      <Head>
        <title>Care resources • PariConnect</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/care" className="text-lg font-semibold text-charcoal">
            ← Back to roster
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
          <h1 className="text-3xl font-semibold text-charcoal">Caregiver resources</h1>
          <div className="grid gap-6 md:grid-cols-3">
            {resources.map((resource) => (
              <Card key={resource.title} className="bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-charcoal">{resource.title}</h2>
                <p className="mt-2 text-sm text-charcoal/70">{resource.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
