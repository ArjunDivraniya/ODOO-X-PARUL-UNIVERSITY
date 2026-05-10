const { errorResponse } = require('../utils/responseHandler');

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return errorResponse(res, 'Forbidden: Admin access required', 403);
  }
  next();
};

module.exports = adminMiddleware;
