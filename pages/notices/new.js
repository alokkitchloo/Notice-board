import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import NoticeForm from '../../components/NoticeForm';

export default function NewNotice() {
  const router = useRouter();

  async function handleCreate(form) {
    const res = await fetch('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const error = new Error(payload.error || 'Failed to create notice.');
      error.errors = payload.errors;
      throw error;
    }

    router.push('/');
  }

  return (
    <>
      <Head>
        <title>New Notice · Notice Board</title>
      </Head>
      <main className="mx-auto min-h-screen max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to notices
        </Link>
        <h1 className="mt-3 mb-6 text-2xl font-bold text-gray-900">New Notice</h1>
        <NoticeForm onSubmit={handleCreate} submitLabel="Create Notice" />
      </main>
    </>
  );
}
