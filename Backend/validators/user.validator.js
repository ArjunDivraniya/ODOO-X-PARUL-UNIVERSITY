const { z } = require('zod');

const updateProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").max(30).optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format").optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  socialLinks: z.string().optional(), // Expected to be stringified JSON from frontend Form Data
  preferences: z.string().optional()  // Expected to be stringified JSON from frontend Form Data
});

module.exports = {
  updateProfileSchema
};
