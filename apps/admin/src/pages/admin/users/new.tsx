import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button, Card, Input, Select } from '@pariconnect/ui';

interface FormValues {
  email: string;
  role: 'CHILD' | 'PARENT' | 'CAREGIVER' | 'ADMIN';
}

export default function InviteUserPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<FormValues>({ defaultValues: { role: 'ADMIN' } });
  const [status, setStatus] = useState<string>('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.post(`${API_URL}/api/admin/users`, values);
      setStatus('Invite queued for delivery.');
      reset({ role: 'ADMIN', email: '' });
    } catch (error) {
      setStatus('Could not create user. Check the API logs.');
    }
  };

  return (
    <div className="main-layout">
      <Head>
        <title>Invite user • PariConnect</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/admin/users" className="text-lg font-semibold text-charcoal">
            ← Back to users
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
          <h1 className="text-3xl font-semibold text-charcoal">Invite team member</h1>
          <Card className="bg-white p-6 shadow-sm">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <label className="block text-sm font-medium text-charcoal">
                Email address
                <Input className="mt-1" type="email" placeholder="name@example.com" {...register('email', { required: true })} />
              </label>
              <label className="block text-sm font-medium text-charcoal">
                Role
                <Select className="mt-1" {...register('role')}>
                  <option value="ADMIN">Admin</option>
                  <option value="CAREGIVER">Caregiver</option>
                  <option value="CHILD">Child</option>
                  <option value="PARENT">Parent</option>
                </Select>
              </label>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                Send invite
              </Button>
            </form>
            {status && <p className="mt-4 text-sm text-charcoal/80">{status}</p>}
          </Card>
        </div>
      </main>
    </div>
  );
}
