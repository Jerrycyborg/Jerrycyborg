import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Table } from '@pariconnect/ui';

interface VisitRow {
  id: string;
  parentName: string;
  caregiverName?: string;
  scheduledAt: string;
  status: string;
  type: string;
}

export default function VisitsPage() {
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  useEffect(() => {
    const load = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/visits`);
        setVisits(response.data.visits ?? []);
      } catch (err) {
        setError('Could not fetch visits.');
      }
    };
    void load();
  }, [API_URL]);

  return (
    <div className="main-layout">
      <Head>
        <title>Visits • PariConnect</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold text-charcoal">
            ← Back to dashboard
          </Link>
          <Button asChild>
            <Link href="/dashboard/book-visit">Schedule visit</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-6xl space-y-4 px-6 py-8">
          <h1 className="text-2xl font-semibold text-charcoal">Upcoming & recent visits</h1>
          <Card className="overflow-x-auto">
            {error && <div className="p-4 text-red-600">{error}</div>}
            {!error && visits.length === 0 && <div className="p-4 text-sm">No visits yet. Book your first caregiver visit.</div>}
            {!error && visits.length > 0 && (
              <Table
                headers={["Parent", "Caregiver", "Scheduled", "Type", "Status"]}
                rows={visits.map((visit) => [
                  visit.parentName,
                  visit.caregiverName ?? 'Unassigned',
                  new Date(visit.scheduledAt).toLocaleString(),
                  visit.type,
                  visit.status
                ])}
              />
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
