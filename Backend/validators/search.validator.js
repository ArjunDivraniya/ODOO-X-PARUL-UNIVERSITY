const { z } = require('zod');

// Accept both `q` (frontend sends) and `query` (internal) as the search term
const queryParam = z
  .string()
  .optional()
  .transform((v) => v || '')
  .pipe(z.string().max(100));

const globalSearchSchema = z.object({
  // Frontend sends `q`, internal code uses `query` – accept both
  q: z.string().min(1).max(100).optional(),
  query: z.string().min(1).max(100).optional(),
  page: z.string().optional().transform(v => parseInt(v) || 1),
  limit: z.string().optional().transform(v => parseInt(v) || 10)
}).transform(data => ({
  ...data,
  // Normalise: service always uses `query`
  query: data.query || data.q || ''
}));

const citySearchSchema = z.object({
  q: z.string().min(1).max(100).optional(),
  query: z.string().min(1).max(100).optional(),
  country: z.string().optional(),
  page: z.string().optional().transform(v => parseInt(v) || 1),
  limit: z.string().optional().transform(v => parseInt(v) || 10)
}).transform(data => ({
  ...data,
  query: data.query || data.q || ''
}));

const activitySearchSchema = z.object({
  q: z.string().min(1).max(100).optional(),
  query: z.string().min(1).max(100).optional(),
  category: z.string().optional(),
  cityId: z.string().uuid().optional(),
  page: z.string().optional().transform(v => parseInt(v) || 1),
  limit: z.string().optional().transform(v => parseInt(v) || 10)
}).transform(data => ({
  ...data,
  query: data.query || data.q || ''
}));

const tripSearchSchema = z.object({
  q: z.string().min(1).max(100).optional(),
  query: z.string().min(1).max(100).optional(),
  tripType: z.string().optional(),
  page: z.string().optional().transform(v => parseInt(v) || 1),
  limit: z.string().optional().transform(v => parseInt(v) || 10)
}).transform(data => ({
  ...data,
  query: data.query || data.q || ''
}));

module.exports = {
  globalSearchSchema,
  citySearchSchema,
  activitySearchSchema,
  tripSearchSchema
};
