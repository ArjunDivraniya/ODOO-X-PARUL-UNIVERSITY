const { z } = require('zod');

const noteSchema = z.object({
  tripId: z.string().uuid(),
  sectionId: z.string().uuid().optional(),
  title: z.string().min(3).max(100),
  content: z.string().min(1).max(5000),
  noteType: z.enum(['JOURNAL', 'MEMORY', 'GENERAL', 'TIPS']).default('JOURNAL')
});

const updateNoteSchema = noteSchema.partial().omit({ tripId: true });

module.exports = {
  noteSchema,
  updateNoteSchema
};
