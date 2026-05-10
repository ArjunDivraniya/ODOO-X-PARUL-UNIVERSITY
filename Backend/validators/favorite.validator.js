const { z } = require('zod');

const favoriteSchema = z.object({
  cityId: z.string().uuid()
});

module.exports = {
  favoriteSchema
};
