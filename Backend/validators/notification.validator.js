const { z } = require('zod');

const updateReadStatusSchema = z.object({
  notificationId: z.string().uuid().optional()
});

module.exports = {
  updateReadStatusSchema
};
