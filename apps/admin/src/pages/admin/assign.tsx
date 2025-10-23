import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { Button, Card, Input, Select } from '@pariconnect/ui';

interface AssignForm {
  visitId: string;
  caregiverId: string;
}

export default function AdminAssignPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<AssignForm>();
  const [status, setStatus] = useState<string>('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  const onSubmit = async (values: AssignForm) => {
    try {
      setStatus('Assigning caregiver…');
      await axios.post(`${API_URL}/api/admin/assign`, values);
      setStatus('Caregiver assigned successfully.');
    } catch (err) {
      setStatus('Could not assign caregiver.');
    }
  };

  return (
    <div className="main-layout">
      <Head>
        <title>Admin • Assign caregiver</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-semibold text-charcoal">
            ← Back to dashboard
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
          <h1 className="text-3xl font-semibold text-charcoal">Assign caregiver</h1>
          <Card className="bg-white p-6 shadow-sm">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <label className="block text-sm font-medium text-charcoal">
                Visit ID
                <Input className="mt-1" placeholder="visit-id" {...register('visitId', { required: true })} />
              </label>
              <label className="block text-sm font-medium text-charcoal">
                Caregiver
              <Select className="mt-1" {...register('caregiverId', { required: true })}>
                <option value="">Select caregiver…</option>
                <option value="caregiver-seed">Priya (Zone South)</option>
                <option value="caregiver-2">Mani (Zone Central)</option>
              </Select>
              </label>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                Assign
              </Button>
            </form>
            {status && <p className="mt-4 text-sm text-charcoal/80">{status}</p>}
          </Card>
        </div>
      </main>
    </div>
  );
}
