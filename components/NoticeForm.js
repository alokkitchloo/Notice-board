import { useState } from 'react';

const CATEGORIES = ['EXAM', 'EVENT', 'GENERAL'];
const PRIORITIES = ['NORMAL', 'URGENT'];

function toDateInputValue(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export default function NoticeForm({ initialValues, onSubmit, submitLabel }) {
  const [form, setForm] = useState({
    title: initialValues?.title || '',
    body: initialValues?.body || '',
    category: initialValues?.category || 'GENERAL',
    priority: initialValues?.priority || 'NORMAL',
    publishDate: toDateInputValue(initialValues?.publishDate) || toDateInputValue(new Date()),
    image: initialValues?.image || '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // Lightweight client-side check purely for UX (server re-validates
  // everything regardless — see pages/api/notices).
  function clientValidate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.body.trim()) e.body = 'Body is required.';
    if (!form.publishDate) e.publishDate = 'Publish date is required.';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const clientErrors = clientValidate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    setServerError('');
    setErrors({});

    try {
      await onSubmit(form);
    } catch (err) {
      if (err?.errors) {
        setErrors(err.errors);
      } else {
        setServerError(err?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {serverError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. Mid-semester exam schedule released"
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Body *</label>
        <textarea
          value={form.body}
          onChange={(e) => update('body', e.target.value)}
          rows={5}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Full notice details..."
        />
        {errors.body && <p className="mt-1 text-xs text-red-600">{errors.body}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0) + c.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => update('priority', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0) + p.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          {errors.priority && <p className="mt-1 text-xs text-red-600">{errors.priority}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Publish date *</label>
          <input
            type="date"
            value={form.publishDate}
            onChange={(e) => update('publishDate', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.publishDate && <p className="mt-1 text-xs text-red-600">{errors.publishDate}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Image URL (optional)</label>
          <input
            type="url"
            value={form.image}
            onChange={(e) => update('image', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="https://..."
          />
          {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto sm:self-start"
      >
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
