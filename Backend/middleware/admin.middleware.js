const { errorResponse } = require('../utils/responseHandler');
const { prisma } = require('../lib/prisma');

const adminMiddleware = async (req, res, next) => {
  if (!req.user?.id) {
    return errorResponse(res, 'Forbidden: Admin access required', 403);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return errorResponse(res, 'Forbidden: Admin access required', 403);
    }

    req.user.role = user.role;
    next();
  } catch (error) {
    return errorResponse(res, 'Failed to verify admin role', 500, error);
  }
};

module.exports = adminMiddleware;
