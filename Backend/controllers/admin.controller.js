const adminService = require('../services/admin.service');
const { blockUserSchema } = require('../validators/admin.validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getDashboard = async (req, res) => {
  try {
    const data = await adminService.getDashboardOverview();
    return successResponse(res, 'Admin dashboard data fetched', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch dashboard', 500, error);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const data = await adminService.getUsers(req.query);
    return successResponse(res, 'Platform users fetched', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch users', 500, error);
  }
};

exports.getTrips = async (req, res) => {
  try {
    const data = await adminService.getTrips(req.query);
    return successResponse(res, 'Platform trips fetched', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch trips', 500, error);
  }
};

exports.getActivities = async (req, res) => {
  try {
    const data = await adminService.getActivities(req.query);
    return successResponse(res, 'Platform activities fetched', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch activities', 500, error);
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { isBlocked } = blockUserSchema.parse(req.body);
    await adminService.updateBlockStatus(req.params.userId, isBlocked);
    return successResponse(res, `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
  } catch (error) {
    return errorResponse(res, 'Failed to update user status', 400, error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await adminService.deleteUser(req.params.userId);
    return successResponse(res, 'User deleted successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to delete user', 400, error);
  }
};

exports.getUserAnalytics = async (req, res) => {
  try {
    const data = await adminService.getUserAnalytics();
    return successResponse(res, 'User analytics data', { analytics: data });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch user analytics', 500, error);
  }
};

exports.getTripAnalytics = async (req, res) => {
  try {
    const data = await adminService.getTripAnalytics();
    return successResponse(res, 'Trip analytics data', { analytics: data });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch trip analytics', 500, error);
  }
};

exports.getCityAnalytics = async (req, res) => {
  try {
    const data = await adminService.getCityAnalytics();
    return successResponse(res, 'City analytics data', { analytics: data });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch city analytics', 500, error);
  }
};

exports.getRevenueAnalytics = async (req, res) => {
  try {
    const data = await adminService.getRevenueAnalytics();
    return successResponse(res, 'Revenue analytics data', { analytics: data });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch revenue analytics', 500, error);
  }
};

exports.getReports = async (req, res) => {
  try {
    // Placeholder for reports - could involve finding content with reports count > 0
    return successResponse(res, 'Moderation reports fetched', { reports: [] });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch reports', 500, error);
  }
};
