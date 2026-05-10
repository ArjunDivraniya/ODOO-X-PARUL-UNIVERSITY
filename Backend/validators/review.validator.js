const { z } = require('zod');

const createReviewSchema = z.object({
  tripId: z.string().uuid().optional(),
  activityId: z.string().uuid().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional()
}).refine(data => data.tripId || data.activityId, {
  message: "Either tripId or activityId must be provided"
});

const updateReviewSchema = createReviewSchema.partial();

module.exports = {
  createReviewSchema,
  updateReviewSchema
};
