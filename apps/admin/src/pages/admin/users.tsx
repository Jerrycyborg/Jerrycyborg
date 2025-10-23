import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Table } from '@pariconnect/ui';

interface UserRow {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  useEffect(() => {
    axios
      .get(`${API_URL}/api/admin/users`)
      .then((res) => setUsers(res.data.users ?? []))
      .catch(() => setUsers([]));
  }, [API_URL]);

  return (
    <div className="main-layout">
      <Head>
        <title>Admin • Users</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-semibold text-charcoal">
            ← Back to dashboard
          </Link>
          <Button asChild>
            <Link href="/admin/users/new">Invite user</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto max-w-5xl space-y-4 px-6 py-8">
          <h1 className="text-2xl font-semibold text-charcoal">Team & caregivers</h1>
          <Card className="overflow-x-auto">
            <Table
              headers={["Email", "Role", "Created"]}
              rows={users.map((user) => [user.email, user.role, new Date(user.createdAt).toLocaleString()])}
            />
          </Card>
        </div>
      </main>
    </div>
  );
}
