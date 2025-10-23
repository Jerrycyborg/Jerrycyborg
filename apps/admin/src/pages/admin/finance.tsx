import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Table } from '@pariconnect/ui';

interface FinanceSnapshot {
  revenue: number;
  refunds: number;
  payouts: number;
  breakdown: { label: string; amount: number }[];
}

export default function AdminFinancePage() {
  const [snapshot, setSnapshot] = useState<FinanceSnapshot | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  useEffect(() => {
    axios
      .get(`${API_URL}/api/admin/finance`)
      .then((res) => setSnapshot(res.data))
      .catch(() => setSnapshot(null));
  }, [API_URL]);

  return (
    <div className="main-layout">
      <Head>
        <title>Admin • Finance</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-semibold text-charcoal">
            ← Back to dashboard
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
          <h1 className="text-2xl font-semibold text-charcoal">Finance overview</h1>
          {snapshot ? (
            <>
              <Card className="grid gap-4 bg-white p-6 shadow-sm md:grid-cols-3">
                <Metric label="Monthly revenue" amount={snapshot.revenue} accent />
                <Metric label="Refunds processed" amount={snapshot.refunds} />
                <Metric label="Payouts due" amount={snapshot.payouts} />
              </Card>
              <Card className="bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-charcoal">Breakdown</h2>
                <Table
                  headers={["Category", "Amount (₹)"]}
                  rows={snapshot.breakdown.map((row) => [row.label, row.amount.toLocaleString('en-IN')])}
                />
              </Card>
            </>
          ) : (
            <Card className="p-4 text-sm text-charcoal/80">Unable to load finance data.</Card>
          )}
        </div>
      </main>
    </div>
  );
}

function Metric({ label, amount, accent = false }: { label: string; amount: number; accent?: boolean }) {
  return (
    <div className={`rounded-md border p-4 ${accent ? 'border-teal bg-teal/10' : 'border-charcoal/10 bg-white'}`}>
      <p className="text-sm text-charcoal/70">{label}</p>
      <p className="text-2xl font-semibold text-charcoal">₹{amount.toLocaleString('en-IN')}</p>
    </div>
  );
}
