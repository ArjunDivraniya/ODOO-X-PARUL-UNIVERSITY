const { z } = require('zod');

const activitySchema = z.object({
  tripId: z.string().uuid(),
  sectionId: z.string().uuid().optional(),
  cityId: z.string().uuid().optional(),
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  category: z.enum(['ADVENTURE', 'FOOD', 'CULTURE', 'NIGHTLIFE', 'NATURE', 'RELAXATION']),
  activityType: z.string().optional(),
  location: z.string().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  duration: z.number().int().positive().optional(),
  price: z.number().nonnegative().default(0),
  bookingUrl: z.string().url().optional().or(z.literal('')),
  image: z.string().url().optional().or(z.literal('')),
  aiRecommended: z.boolean().default(false)
});

const updateActivitySchema = activitySchema.partial().omit({ tripId: true });

module.exports = {
  activitySchema,
  updateActivitySchema
};
