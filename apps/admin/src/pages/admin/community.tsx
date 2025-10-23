import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge, Button, Card, Textarea } from '@pariconnect/ui';

interface Post {
  id: string;
  title: string;
  body: string;
  status: string;
  createdAt: string;
}

interface Feedback {
  id: string;
  from: string;
  label: string;
  message: string;
}

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  useEffect(() => {
    axios
      .get(`${API_URL}/api/admin/community`)
      .then((res) => {
        setPosts(res.data.posts ?? []);
        setFeedback(res.data.feedback ?? []);
      })
      .catch(() => {
        setPosts([]);
        setFeedback([]);
      });
  }, [API_URL]);

  const postAnnouncement = async () => {
    try {
      await axios.post(`${API_URL}/api/admin/community`, { body: announcement });
      setAnnouncement('');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to post announcement', error);
    }
  };

  return (
    <div className="main-layout">
      <Head>
        <title>Admin • Community</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-semibold text-charcoal">
            ← Back to dashboard
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-ivory">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-2">
          <Card className="space-y-4 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-charcoal">Community board</h2>
            {posts.length === 0 && <p className="text-sm text-charcoal/70">No posts yet.</p>}
            <ul className="space-y-3">
              {posts.map((post) => (
                <li key={post.id} className="rounded-md border border-charcoal/10 p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-charcoal">{post.title}</h3>
                    <Badge variant={post.status === 'published' ? 'accent' : 'default'}>{post.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-charcoal/70">{post.body}</p>
                  <p className="mt-2 text-xs text-charcoal/50">{new Date(post.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <Textarea
                value={announcement}
                onChange={(event) => setAnnouncement(event.target.value)}
                placeholder="Write a new announcement…"
              />
              <Button onClick={postAnnouncement}>Post announcement</Button>
            </div>
          </Card>
          <Card className="space-y-4 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-charcoal">Feedback inbox</h2>
            {feedback.length === 0 && <p className="text-sm text-charcoal/70">No feedback yet.</p>}
            <ul className="space-y-3">
              {feedback.map((item) => (
                <li key={item.id} className="rounded-md border border-charcoal/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-charcoal">{item.from}</span>
                    <Badge>{item.label}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-charcoal/80">{item.message}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
