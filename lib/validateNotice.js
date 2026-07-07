const VALID_CATEGORIES = ['EXAM', 'EVENT', 'GENERAL'];
const VALID_PRIORITIES = ['NORMAL', 'URGENT'];

// Runs on the server, inside the API routes. Returns { valid, errors, data }.
// `data` holds cleaned/coerced values ready to hand to Prisma when valid.
export function validateNotice(body) {
  const errors = {};
  const { title, body: noticeBody, category, priority, publishDate, image } = body || {};

  if (typeof title !== 'string' || title.trim().length === 0) {
    errors.title = 'Title is required.';
  }

  if (typeof noticeBody !== 'string' || noticeBody.trim().length === 0) {
    errors.body = 'Body is required.';
  }

  const normalizedCategory = typeof category === 'string' ? category.toUpperCase() : '';
  if (!VALID_CATEGORIES.includes(normalizedCategory)) {
    errors.category = `Category must be one of ${VALID_CATEGORIES.join(', ')}.`;
  }

  const normalizedPriority = typeof priority === 'string' ? priority.toUpperCase() : 'NORMAL';
  if (!VALID_PRIORITIES.includes(normalizedPriority)) {
    errors.priority = `Priority must be one of ${VALID_PRIORITIES.join(', ')}.`;
  }

  let parsedDate = null;
  if (!publishDate) {
    errors.publishDate = 'Publish date is required.';
  } else {
    parsedDate = new Date(publishDate);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.publishDate = 'Publish date must be a valid date.';
    }
  }

  if (image !== undefined && image !== null && image !== '' && typeof image !== 'string') {
    errors.image = 'Image must be a URL string.';
  }

  const valid = Object.keys(errors).length === 0;

  return {
    valid,
    errors,
    data: valid
      ? {
          title: title.trim(),
          body: noticeBody.trim(),
          category: normalizedCategory,
          priority: normalizedPriority,
          publishDate: parsedDate,
          image: image && image.trim() !== '' ? image.trim() : null,
        }
      : null,
  };
}
