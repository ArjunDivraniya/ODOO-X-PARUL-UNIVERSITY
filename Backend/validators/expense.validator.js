const { z } = require('zod');

const expenseSchema = z.object({
  tripId: z.string().uuid(),
  sectionId: z.string().uuid().optional(),
  category: z.enum(['HOTEL', 'FOOD', 'TRANSPORT', 'ACTIVITY', 'SHOPPING', 'OTHER']),
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  amount: z.number().positive(),
  quantity: z.number().int().positive().default(1),
  expenseDate: z.string().datetime().optional(),
  paymentStatus: z.string().optional(),
  receiptImage: z.string().url().optional().or(z.literal(''))
});

const updateExpenseSchema = expenseSchema.partial().omit({ tripId: true });

module.exports = {
  expenseSchema,
  updateExpenseSchema
};
