import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { Button, Card, Badge } from '@pariconnect/ui';
import type { ParentTimelineEntry } from '@pariconnect/types';

interface ParentSummary {
  parentId: string;
  name: string;
  language: string;
  timeline: ParentTimelineEntry[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ParentSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  useEffect(() => {
    const load = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/parent/mock-child/summary`);
        setData(response.data.parents ?? []);
      } catch (err) {
        setError('Unable to load family timeline. Start the API first.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [API_URL]);

  return (
    <div className="main-layout">
      <Head>
        <title>PariConnect Dashboard</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-semibold text-charcoal">
            PariConnect
          </Link>
          <div className="space-x-4 text-sm">
            <Link href="/dashboard">Timeline</Link>
            <Link href="/dashboard/visits">Visits</Link>
            <Link href="/dashboard/subscriptions">Subscriptions</Link>
            <Link href="/dashboard/reports">Reports</Link>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-charcoal">Family timeline</h1>
            <Button asChild>
              <Link href="/dashboard/book-visit">Book a visit</Link>
            </Button>
          </div>
          {loading && <Card className="p-6">Loading timeline…</Card>}
          {error && <Card className="p-6 text-red-600">{error}</Card>}
          {!loading && !error &&
            data.map((parent) => (
              <Card key={parent.parentId} className="bg-white p-6 shadow-sm">
                <header className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-charcoal">{parent.name}</h2>
                    <p className="text-sm text-charcoal/70">Preferred language: {parent.language === 'ta' ? 'தமிழ்' : 'English'}</p>
                  </div>
                  <Badge variant="accent">Last 7 days</Badge>
                </header>
                <Timeline entries={parent.timeline} />
              </Card>
            ))}
        </div>
      </main>
    </div>
  );
}

function Timeline({ entries }: { entries: ParentTimelineEntry[] }) {
  if (!entries.length) {
    return <p className="text-sm text-charcoal/70">No recent activity yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {entries.map((entry) => (
        <li key={`${entry.type}-${entry.timestamp}`} className="flex items-start gap-3">
          <span className="mt-1 h-3 w-3 rounded-full bg-teal" aria-hidden />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-sm text-charcoal/70">
              <span className="font-medium text-charcoal">{formatLabel(entry)}</span>
              <time dateTime={entry.timestamp}>{new Date(entry.timestamp).toLocaleString()}</time>
            </div>
            <p className="text-sm text-charcoal/80">{summariseEntry(entry)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function formatLabel(entry: ParentTimelineEntry) {
  switch (entry.type) {
    case 'checkin':
      return 'Check-in';
    case 'visit':
      return 'Caregiver visit';
    case 'alert':
      return 'Alert';
    default:
      return entry.type;
  }
}

function summariseEntry(entry: ParentTimelineEntry) {
  switch (entry.type) {
    case 'checkin': {
      const mood = entry.data['mood'];
      const note = entry.data['note'];
      return `Mood: ${mood}${note ? ` — ${note}` : ''}`;
    }
    case 'visit':
      return `Status: ${entry.data['status']} (${entry.data['type']})`;
    case 'alert':
      return `Type: ${entry.data['type']}`;
    default:
      return 'Activity';
  }
}
