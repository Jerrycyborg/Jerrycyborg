import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge, Button, Card, Table } from '@pariconnect/ui';

interface DashboardData {
  kpis: { label: string; value: string }[];
  alerts: { id: string; parentName: string; type: string; createdAt: string }[];
  payoutsDue: { caregiver: string; amount: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  useEffect(() => {
    axios
      .get(`${API_URL}/api/admin/dashboard`)
      .then((res) => setData(res.data))
      .catch(() => setError('Unable to load admin KPIs. Start the API to view live numbers.'));
  }, [API_URL]);

  return (
    <div className="main-layout">
      <Head>
        <title>Admin • PariConnect</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-semibold text-charcoal">
            PariConnect Admin
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/visits">Visits</Link>
            <Link href="/admin/finance">Finance</Link>
            <Link href="/admin/community">Community</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-charcoal">Operations overview</h1>
            <Button asChild>
              <Link href="/admin/assign">Assign caregiver</Link>
            </Button>
          </div>
          {error && <Card className="p-4 text-red-600">{error}</Card>}
          {data && (
            <>
              <section className="grid gap-4 md:grid-cols-3">
                {data.kpis.map((kpi) => (
                  <Card key={kpi.label} className="bg-white p-6 shadow-sm">
                    <p className="text-sm text-charcoal/70">{kpi.label}</p>
                    <p className="text-3xl font-bold text-charcoal">{kpi.value}</p>
                  </Card>
                ))}
              </section>
              <Card className="bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-charcoal">Open alerts</h2>
                <Table
                  headers={["Parent", "Type", "Created"]}
                  rows={data.alerts.map((alert) => [
                    alert.parentName,
                    <Badge key={alert.id} variant={alert.type === 'sos' ? 'accent' : 'default'}>
                      {alert.type}
                    </Badge>,
                    new Date(alert.createdAt).toLocaleString()
                  ])}
                />
              </Card>
              <Card className="bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-charcoal">Upcoming payouts</h2>
                <Table
                  headers={["Caregiver", "Amount (₹)"]}
                  rows={data.payoutsDue.map((payout) => [payout.caregiver, payout.amount.toLocaleString('en-IN')])}
                />
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
