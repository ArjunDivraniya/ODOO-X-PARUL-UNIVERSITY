const prisma = require('../lib/prisma');

/**
 * Generates a unique slug from a string (e.g. trip title)
 * @param {string} text - The input text to slugify
 * @returns {string} - A unique URL-friendly slug
 */
const generateSlug = async (text) => {
  // Convert to lowercase, remove non-alphanumeric chars, replace spaces with hyphens
  const baseSlug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  let slug = baseSlug || 'trip';
  let isUnique = false;
  let counter = 0;

  while (!isUnique) {
    const existingTrip = await prisma.trip.findUnique({
      where: { slug }
    });

    if (!existingTrip) {
      isUnique = true;
    } else {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  return slug;
};

module.exports = generateSlug;
