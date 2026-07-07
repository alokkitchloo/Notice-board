import Link from 'next/link';

const CATEGORY_STYLES = {
  EXAM: 'bg-purple-100 text-purple-700',
  EVENT: 'bg-blue-100 text-blue-700',
  GENERAL: 'bg-gray-100 text-gray-700',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NoticeCard({ notice, onDelete }) {
  const isUrgent = notice.priority === 'URGENT';

  return (
    <div
      className={`flex flex-col rounded-xl border bg-white shadow-sm overflow-hidden transition hover:shadow-md ${
        isUrgent ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200'
      }`}
    >
      {notice.image ? (
        <img
          src={notice.image}
          alt={notice.title}
          className="h-40 w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {isUrgent && (
            <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              Urgent
            </span>
          )}
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_STYLES[notice.category] || CATEGORY_STYLES.GENERAL}`}>
            {notice.category}
          </span>
          <span className="ml-auto text-xs text-gray-400">{formatDate(notice.publishDate)}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{notice.title}</h3>
        <p className="flex-1 text-sm text-gray-600 line-clamp-3">{notice.body}</p>

        <div className="mt-2 flex gap-2 border-t pt-3">
          <Link
            href={`/notices/${notice.id}/edit`}
            className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(notice.id)}
            className="flex-1 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
