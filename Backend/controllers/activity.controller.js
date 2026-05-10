const activityService = require('../services/activity.service');
const { activitySchema, updateActivitySchema } = require('../validators/activity.validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.createActivity = async (req, res) => {
  try {
    const validatedData = activitySchema.parse(req.body);
    const activity = await activityService.createActivity(req.user.id, validatedData);
    return successResponse(res, 'Activity created successfully', { activity });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to create activity', 400, error);
  }
};

exports.getTripActivities = async (req, res) => {
  try {
    const { tripId } = req.params;
    // Check if user owns the trip (handled in service or here)
    const data = await activityService.getTripActivities(tripId, req.query);
    return successResponse(res, 'Trip activities fetched successfully', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch activities', 500, error);
  }
};

exports.getActivityById = async (req, res) => {
  try {
    const activity = await activityService.getActivityById(req.params.activityId, req.user?.id);
    return successResponse(res, 'Activity details fetched successfully', { activity });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch activity details', 404, error);
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const validatedData = updateActivitySchema.parse(req.body);
    const activity = await activityService.updateActivity(req.params.activityId, req.user.id, validatedData);
    return successResponse(res, 'Activity updated successfully', { activity });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to update activity', 400, error);
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    await activityService.deleteActivity(req.params.activityId, req.user.id);
    return successResponse(res, 'Activity deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to delete activity', 400, error);
  }
};

exports.getRecommended = async (req, res) => {
  try {
    const recommendedActivities = await activityService.getRecommendedActivities(req.query);
    return successResponse(res, 'Recommended activities fetched successfully', { recommendedActivities });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch recommendations', 500, error);
  }
};

exports.getTrending = async (req, res) => {
  try {
    const trendingActivities = await activityService.getTrendingActivities();
    return successResponse(res, 'Trending activities fetched successfully', { trendingActivities });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch trending activities', 500, error);
  }
};

exports.saveActivity = async (req, res) => {
  try {
    await activityService.saveActivity(req.user.id, req.params.activityId);
    return successResponse(res, 'Activity saved successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to save activity', 500, error);
  }
};

exports.unsaveActivity = async (req, res) => {
  try {
    await activityService.unsaveActivity(req.user.id, req.params.activityId);
    return successResponse(res, 'Saved activity removed successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to remove saved activity', 500, error);
  }
};
