import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { Button, Card, Input, Select } from '@pariconnect/ui';

interface VisitForm {
  parentId: string;
  type: string;
  scheduledAt: string;
  notes?: string;
}

export default function BookVisitPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<VisitForm>({
    defaultValues: {
      parentId: 'parent-seed',
      type: 'companion'
    }
  });
  const [message, setMessage] = useState<string>('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  const onSubmit = async (values: VisitForm) => {
    try {
      setMessage('Submitting…');
      await axios.post(`${API_URL}/api/visit`, values);
      setMessage('Visit booked successfully. Admin will assign a caregiver soon.');
    } catch (err) {
      setMessage('Could not create visit.');
    }
  };

  return (
    <div className="main-layout">
      <Head>
        <title>Book a visit • PariConnect</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold text-charcoal">
            ← Back to dashboard
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-charcoal">Book a caregiver visit</h1>
            <p className="text-sm text-charcoal/70">Pick a slot and visit type. SOS requests are escalated instantly.</p>
          </div>
          <Card className="bg-white p-6 shadow-sm">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <label className="block text-sm font-medium text-charcoal">
                Parent
                <Input {...register('parentId')} className="mt-1" aria-invalid={!!errors.parentId} />
              </label>
              <label className="block text-sm font-medium text-charcoal">
                Visit type
                <Select className="mt-1" {...register('type')}>
                  <option value="companion">Companion</option>
                  <option value="errand">Errand</option>
                  <option value="escort">Escort</option>
                </Select>
              </label>
              <label className="block text-sm font-medium text-charcoal">
                Scheduled at
                <Input type="datetime-local" className="mt-1" {...register('scheduledAt', { required: true })} />
              </label>
              <label className="block text-sm font-medium text-charcoal">
                Notes
                <textarea className="mt-1 w-full rounded-md border border-charcoal/20 p-2" rows={4} {...register('notes')} />
              </label>
              <Button type="submit" className="w-full">
                Submit request
              </Button>
            </form>
            {message && <p className="mt-4 text-sm text-charcoal/80">{message}</p>}
          </Card>
        </div>
      </main>
    </div>
  );
}
