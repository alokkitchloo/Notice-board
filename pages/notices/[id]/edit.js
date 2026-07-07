import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import prisma from '../../../lib/prisma';
import NoticeForm from '../../../components/NoticeForm';

export async function getServerSideProps({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return { notFound: true };
  }

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) {
    return { notFound: true };
  }

  return {
    props: {
      notice: JSON.parse(JSON.stringify(notice)),
    },
  };
}

export default function EditNotice({ notice }) {
  const router = useRouter();

  async function handleUpdate(form) {
    const res = await fetch(`/api/notices/${notice.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const error = new Error(payload.error || 'Failed to update notice.');
      error.errors = payload.errors;
      throw error;
    }

    router.push('/');
  }

  return (
    <>
      <Head>
        <title>Edit Notice · Notice Board</title>
      </Head>
      <main className="mx-auto min-h-screen max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to notices
        </Link>
        <h1 className="mt-3 mb-6 text-2xl font-bold text-gray-900">Edit Notice</h1>
        <NoticeForm initialValues={notice} onSubmit={handleUpdate} submitLabel="Save Changes" />
      </main>
    </>
  );
}
