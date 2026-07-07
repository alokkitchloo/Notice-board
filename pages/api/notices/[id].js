import prisma from '../../../lib/prisma';
import { validateNotice } from '../../../lib/validateNotice';

export default async function handler(req, res) {
  const { id } = req.query;
  const noticeId = Number(id);

  if (!Number.isInteger(noticeId) || noticeId <= 0) {
    return res.status(400).json({ error: 'Invalid notice id.' });
  }

  if (req.method === 'GET') {
    try {
      const notice = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!notice) return res.status(404).json({ error: 'Notice not found.' });
      return res.status(200).json(notice);
    } catch (err) {
      console.error(`GET /api/notices/${id} failed:`, err);
      return res.status(500).json({ error: 'Failed to fetch notice.' });
    }
  }

  if (req.method === 'PUT') {
    const { valid, errors, data } = validateNotice(req.body);
    if (!valid) {
      return res.status(400).json({ error: 'Validation failed.', errors });
    }
    try {
      const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!existing) return res.status(404).json({ error: 'Notice not found.' });

      const notice = await prisma.notice.update({ where: { id: noticeId }, data });
      return res.status(200).json(notice);
    } catch (err) {
      console.error(`PUT /api/notices/${id} failed:`, err);
      return res.status(500).json({ error: 'Failed to update notice.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!existing) return res.status(404).json({ error: 'Notice not found.' });

      await prisma.notice.delete({ where: { id: noticeId } });
      return res.status(204).end();
    } catch (err) {
      console.error(`DELETE /api/notices/${id} failed:`, err);
      return res.status(500).json({ error: 'Failed to delete notice.' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
