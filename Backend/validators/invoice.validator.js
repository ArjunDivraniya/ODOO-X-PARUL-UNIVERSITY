const { z } = require('zod');

const generateInvoiceSchema = z.object({
  tripId: z.string().uuid(),
  tax: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  paymentMethod: z.string().optional().default('CARD')
});

const updateStatusSchema = z.object({
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])
});

module.exports = {
  generateInvoiceSchema,
  updateStatusSchema
};
