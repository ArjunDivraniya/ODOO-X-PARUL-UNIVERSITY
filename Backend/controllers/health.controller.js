const healthService = require('../services/health.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getHealth = async (req, res) => {
  try {
    const status = await healthService.getStatus();
    return successResponse(res, 'System is healthy', status);
  } catch (error) {
    return errorResponse(res, 'System unhealthy', 500, error);
  }
};

exports.getVersion = async (req, res) => {
  try {
    const version = healthService.getVersion();
    return successResponse(res, 'Version information', version);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch version', 500, error);
  }
};
