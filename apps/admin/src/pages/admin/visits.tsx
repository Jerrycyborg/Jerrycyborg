import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge, Button, Card, Table } from '@pariconnect/ui';

interface VisitRow {
  id: string;
  parentName: string;
  caregiverName?: string;
  status: string;
  scheduledAt: string;
}

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  useEffect(() => {
    axios
      .get(`${API_URL}/api/admin/visits`)
      .then((res) => setVisits(res.data.visits ?? []))
      .catch(() => setVisits([]));
  }, [API_URL]);

  return (
    <div className="main-layout">
      <Head>
        <title>Admin • Visits</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-semibold text-charcoal">
            ← Back to dashboard
          </Link>
          <Button asChild>
            <Link href="/admin/assign">Assign caregiver</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-6xl space-y-4 px-6 py-8">
          <h1 className="text-2xl font-semibold text-charcoal">Visit management</h1>
          <Card className="overflow-x-auto">
            <Table
              headers={["Parent", "Caregiver", "Scheduled", "Status"]}
              rows={visits.map((visit) => [
                visit.parentName,
                visit.caregiverName ?? 'Unassigned',
                new Date(visit.scheduledAt).toLocaleString(),
                <Badge key={visit.id} variant={visit.status === 'late' ? 'destructive' : 'default'}>
                  {visit.status}
                </Badge>
              ])}
            />
          </Card>
        </div>
      </main>
    </div>
  );
}
