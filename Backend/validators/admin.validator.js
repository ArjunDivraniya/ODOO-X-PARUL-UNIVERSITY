const { z } = require('zod');

const blockUserSchema = z.object({
  isBlocked: z.boolean()
});

module.exports = {
  blockUserSchema
};
