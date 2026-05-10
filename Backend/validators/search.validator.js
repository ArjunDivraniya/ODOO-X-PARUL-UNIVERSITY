const { z } = require('zod');

const globalSearchSchema = z.object({
  query: z.string().min(1).max(100),
  page: z.string().optional().transform(v => parseInt(v) || 1),
  limit: z.string().optional().transform(v => parseInt(v) || 10)
});

const citySearchSchema = globalSearchSchema.extend({
  country: z.string().optional()
});

const activitySearchSchema = globalSearchSchema.extend({
  category: z.string().optional(),
  cityId: z.string().uuid().optional()
});

const tripSearchSchema = globalSearchSchema.extend({
  tripType: z.string().optional()
});

module.exports = {
  globalSearchSchema,
  citySearchSchema,
  activitySearchSchema,
  tripSearchSchema
};
