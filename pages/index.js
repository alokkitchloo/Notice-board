import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import prisma from '../lib/prisma';
import NoticeCard from '../components/NoticeCard';

export async function getServerSideProps() {
  // Same Urgent-first ordering as the API route, done in the DB query.
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: 'desc' }, { publishDate: 'desc' }],
  });

  return {
    props: {
      initialNotices: JSON.parse(JSON.stringify(notices)),
    },
  };
}

export default function Home({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function requestDelete(id) {
    setPendingDeleteId(id);
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/notices/${pendingDeleteId}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        throw new Error('Failed to delete notice.');
      }
      setNotices((prev) => prev.filter((n) => n.id !== pendingDeleteId));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
      setPendingDeleteId(null);
    }
  }

  return (
    <>
      <Head>
        <title>Notice Board</title>
      </Head>

      <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Notice Board</h1>
            <p className="mt-1 text-sm text-gray-500">
              {notices.length} notice{notices.length !== 1 ? 's' : ''} · Urgent notices appear first
            </p>
          </div>
          <Link
            href="/notices/new"
            className="shrink-0 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + New Notice
          </Link>
        </div>

        {notices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-500">
            No notices yet. Create the first one.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} onDelete={requestDelete} />
            ))}
          </div>
        )}
      </main>

      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900">Delete this notice?</h2>
            <p className="mt-2 text-sm text-gray-600">This action cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
