const { z } = require('zod');

const TripTypeEnum = z.enum(['LEISURE', 'BUSINESS', 'BACKPACKING', 'FAMILY', 'COUPLE', 'SOLO', 'OTHER'], {
  errorMap: () => ({ message: 'Invalid trip type' })
}).optional();

const VisibilityEnum = z.enum(['PRIVATE', 'PUBLIC', 'FRIENDS'], {
  errorMap: () => ({ message: 'Visibility must be PRIVATE, PUBLIC, or FRIENDS' })
});

const StatusEnum = z.enum(['PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED'], {
  errorMap: () => ({ message: 'Status must be PLANNING, ACTIVE, COMPLETED, or CANCELLED' })
});

exports.createTripSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
    tripType: z.string().optional(),
    startDate: z.string().datetime({ message: 'Invalid start date format' }).optional().nullable(),
    endDate: z.string().datetime({ message: 'Invalid end date format' }).optional().nullable(),
    estimatedBudget: z.number().nonnegative('Budget cannot be negative').optional().nullable(),
    currency: z.string().length(3, 'Currency must be a 3-letter code').optional(),
    travelersCount: z.number().int().min(1, 'Travelers count must be at least 1').optional(),
    visibility: VisibilityEnum.optional(),
    aiGenerated: z.boolean().optional()
  })
});

exports.updateTripSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().max(1000).optional(),
    tripType: z.string().optional(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    estimatedBudget: z.number().nonnegative().optional().nullable(),
    currency: z.string().length(3).optional()
  })
});

exports.updateVisibilitySchema = z.object({
  body: z.object({
    visibility: VisibilityEnum
  })
});

exports.updateStatusSchema = z.object({
  body: z.object({
    status: StatusEnum
  })
});

exports.generateAITripSchema = z.object({
  body: z.object({
    destination: z.string().min(2, 'Destination is required'),
    duration: z.number().int().min(1).max(30),
    budget: z.number().nonnegative().optional(),
    tripType: z.string().optional(),
    interests: z.array(z.string()).optional()
  })
});
