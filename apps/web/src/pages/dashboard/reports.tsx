import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import { Button, Card } from '@pariconnect/ui';

export default function ReportsPage() {
  const [status, setStatus] = useState<string>('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  const generatePdf = async (parentId: string) => {
    try {
      setStatus('Generating report…');
      const response = await axios.get(
        `${API_URL}/api/report/${parentId}/monthly.pdf`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pariconnect-${parentId}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      setStatus('Report downloaded.');
    } catch (err) {
      setStatus('Could not generate report.');
    }
  };

  return (
    <div className="main-layout">
      <Head>
        <title>Reports • PariConnect</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold text-charcoal">
            ← Back to dashboard
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-charcoal">Monthly reports</h1>
            <p className="text-sm text-charcoal/70">Download PDF summaries with check-ins, visits, and optional photos.</p>
          </div>
          <Card className="space-y-4 bg-white p-6 shadow-sm">
            <p className="text-sm text-charcoal/80">
              Reports are generated using server-side Puppeteer to stitch together check-ins, visit proofs, payments, and caregiver
              feedback for the month.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => generatePdf('parent-seed')}>Download parent report</Button>
              {status && <span className="text-sm text-charcoal/80">{status}</span>}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
