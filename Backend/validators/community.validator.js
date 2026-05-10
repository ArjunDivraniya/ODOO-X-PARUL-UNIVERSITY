const { z } = require('zod');

const postSchema = z.object({
  // tripId comes from FormData as a string; empty string → treat as absent
  tripId: z.string().uuid().optional().or(z.literal('').transform(() => undefined)),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  content: z.string().min(1, 'Content is required').max(5000),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'FRIENDS']).default('PUBLIC')
});

const updatePostSchema = postSchema.partial();

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000)
});

module.exports = {
  postSchema,
  updatePostSchema,
  commentSchema
};
