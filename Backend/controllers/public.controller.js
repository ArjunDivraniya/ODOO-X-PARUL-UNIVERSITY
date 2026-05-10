const publicService = require('../services/public.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getPublicTrip = async (req, res) => {
  try {
    const trip = await publicService.getPublicTrip(req.params.shareCode);
    return successResponse(res, 'Public trip fetched successfully', { trip });
  } catch (error) {
    return errorResponse(res, error.message || 'Shared trip not found', 404, error);
  }
};

exports.copyTrip = async (req, res) => {
  try {
    const trip = await publicService.copyTrip(req.params.shareCode, req.user.id);
    return successResponse(res, 'Trip copied successfully', { trip });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to copy trip', 400, error);
  }
};
