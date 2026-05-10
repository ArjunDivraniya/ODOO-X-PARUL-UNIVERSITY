const analyticsService = require('../services/analytics.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getUserAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getUserAnalytics(req.user.id);
    return successResponse(res, 'User analytics fetched', { analytics: data });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch user analytics', 500, error);
  }
};

exports.getTripAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getTripAnalytics(req.params.tripId, req.user.id);
    return successResponse(res, 'Trip analytics fetched', { analytics: data });
  } catch (error) {
    return errorResponse(res, error.message, 500, error);
  }
};

exports.getCommunityAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getCommunityAnalytics();
    return successResponse(res, 'Community analytics fetched', { analytics: data });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch community analytics', 500, error);
  }
};
