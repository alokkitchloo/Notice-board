import prisma from '../../../lib/prisma';
import { validateNotice } from '../../../lib/validateNotice';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Urgent-first ordering, done entirely in the database query.
      // Priority is stored as an enum (NORMAL / URGENT). Prisma orders enum
      // columns by their underlying string value, and "URGENT" > "NORMAL"
      // alphabetically — so priority: 'desc' puts every Urgent notice above
      // every Normal notice, regardless of date. Within each priority group
      // we then order by publishDate (newest first) as the "reasonable
      // order" for Normal notices called for in the brief.
      const notices = await prisma.notice.findMany({
        orderBy: [{ priority: 'desc' }, { publishDate: 'desc' }],
      });
      return res.status(200).json(notices);
    } catch (err) {
      console.error('GET /api/notices failed:', err);
      return res.status(500).json({ error: 'Failed to fetch notices.' });
    }
  }

  if (req.method === 'POST') {
    const { valid, errors, data } = validateNotice(req.body);
    if (!valid) {
      return res.status(400).json({ error: 'Validation failed.', errors });
    }
    try {
      const notice = await prisma.notice.create({ data });
      return res.status(201).json(notice);
    } catch (err) {
      console.error('POST /api/notices failed:', err);
      return res.status(500).json({ error: 'Failed to create notice.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
