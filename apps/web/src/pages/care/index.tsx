import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Table, Badge } from '@pariconnect/ui';

interface Visit {
  id: string;
  parentName: string;
  scheduledAt: string;
  status: string;
  type: string;
  consentPhoto: boolean;
}

export default function CaregiverDashboard() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [message, setMessage] = useState<string>('Loading visits…');
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  useEffect(() => {
    axios
      .get(`${API_URL}/api/visits?me=today`)
      .then((res) => {
        setVisits(res.data.visits ?? []);
        setMessage('');
      })
      .catch(() => setMessage('Unable to load visit roster.'));
  }, [API_URL]);

  const startVisit = async (visitId: string) => {
    try {
      await axios.post(`${API_URL}/api/visit/${visitId}/start`, {
        selfieUrl: 'https://placehold.co/200x200',
        geo: '13.0827,80.2707'
      });
      setMessage('Visit started. Remember to capture consent and completion proof.');
    } catch (error) {
      setMessage('Could not start visit. Try again.');
    }
  };

  const completeVisit = async (visitId: string) => {
    try {
      await axios.post(`${API_URL}/api/visit/${visitId}/complete`, {
        selfieUrl: 'https://placehold.co/200x200',
        geo: '13.0827,80.2707',
        notes: 'Visit completed successfully',
        photos: ['https://placehold.co/400x300'],
        consentPhoto: true
      });
      setMessage('Visit completion submitted.');
    } catch (error) {
      setMessage('Could not complete visit. Check consent and try again.');
    }
  };

  return (
    <div className="main-layout">
      <Head>
        <title>Caregiver visits • PariConnect</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-semibold text-charcoal">
            PariConnect Care
          </Link>
          <Button asChild>
            <Link href="/care/resources">Resources</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-charcoal">Today&apos;s visits</h1>
            <p className="text-sm text-charcoal/70">
              Start and complete visits with required selfie, geotag, and consent proof.
            </p>
          </div>
          {message && <Card className="p-4 text-sm text-charcoal/80">{message}</Card>}
          {visits.length > 0 && (
            <Card className="overflow-x-auto">
              <Table
                headers={["Parent", "Scheduled", "Type", "Status", "Consent", "Actions"]}
                rows={visits.map((visit) => [
                  visit.parentName,
                  new Date(visit.scheduledAt).toLocaleTimeString(),
                  visit.type,
                  <Badge key={`${visit.id}-status`} variant={visit.status === 'completed' ? 'accent' : 'default'}>
                    {visit.status}
                  </Badge>,
                  visit.consentPhoto ? 'Yes' : 'Pending',
                  <div key={`${visit.id}-actions`} className="flex gap-2">
                    <Button size="sm" onClick={() => startVisit(visit.id)}>
                      Start
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => completeVisit(visit.id)}>
                      Complete
                    </Button>
                  </div>
                ])}
              />
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
