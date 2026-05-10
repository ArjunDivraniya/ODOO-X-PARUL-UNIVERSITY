const { z } = require('zod');

exports.createSectionSchema = z.object({
  body: z.object({
    tripId: z.string().uuid('Invalid trip ID'),
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().max(500).optional(),
    cityId: z.string().uuid('Invalid city ID').optional().nullable(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    sectionOrder: z.number().int().nonnegative().optional(),
    estimatedBudget: z.number().nonnegative().optional(),
    transportType: z.string().max(50).optional()
  })
});

exports.updateSectionSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    cityId: z.string().uuid().optional().nullable(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    sectionOrder: z.number().int().nonnegative().optional(),
    estimatedBudget: z.number().nonnegative().optional(),
    transportType: z.string().max(50).optional()
  })
});

exports.reorderSectionsSchema = z.object({
  body: z.array(
    z.object({
      id: z.string().uuid('Invalid section ID'),
      sectionOrder: z.number().int().nonnegative('Order must be non-negative')
    })
  ).min(1, 'At least one section is required for reordering')
});
