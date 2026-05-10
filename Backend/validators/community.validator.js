const { z } = require('zod');

const postSchema = z.object({
  tripId: z.string().uuid().optional(),
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(5000),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'SHARED']).default('PUBLIC')
});

const updatePostSchema = postSchema.partial();

const commentSchema = z.object({
  content: z.string().min(1).max(1000)
});

module.exports = {
  postSchema,
  updatePostSchema,
  commentSchema
};
