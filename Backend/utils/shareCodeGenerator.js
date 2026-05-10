const crypto = require('crypto');
const prisma = require('../lib/prisma');

/**
 * Generates a unique 8-character alphanumeric share code
 * @returns {string} - A unique share code
 */
const generateShareCode = async () => {
  let isUnique = false;
  let code = '';

  while (!isUnique) {
    // Generate an 8 character random alphanumeric string
    code = crypto.randomBytes(4).toString('hex');
    
    const existingTrip = await prisma.trip.findUnique({
      where: { shareCode: code }
    });

    if (!existingTrip) {
      isUnique = true;
    }
  }

  return code;
};

module.exports = generateShareCode;
