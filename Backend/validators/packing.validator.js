const { z } = require('zod');

const packingItemSchema = z.object({
  tripId: z.string().uuid(),
  title: z.string().min(1).max(100),
  category: z.string().max(50).optional().default('General'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'NORMAL']).optional().default('NORMAL')
});

const updatePackingItemSchema = packingItemSchema.partial().omit({ tripId: true });

module.exports = {
  packingItemSchema,
  updatePackingItemSchema
};
