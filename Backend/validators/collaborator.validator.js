const { z } = require('zod');

const inviteCollaboratorSchema = z.object({
  tripId: z.string().uuid(),
  email: z.string().email(),
  permission: z.enum(['VIEWER', 'EDITOR', 'ADMIN']).default('VIEWER')
});

const updatePermissionSchema = z.object({
  permission: z.enum(['VIEWER', 'EDITOR', 'ADMIN'])
});

module.exports = {
  inviteCollaboratorSchema,
  updatePermissionSchema
};
