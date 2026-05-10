const notificationService = require('../services/notification.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getNotifications = async (req, res) => {
  try {
    const data = await notificationService.getNotifications(req.user.id, req.query);
    return successResponse(res, 'Notifications fetched successfully', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch notifications', 500, error);
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await notificationService.markAsRead(req.params.notificationId, req.user.id);
    return successResponse(res, 'Notification marked as read');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to update notification', 400, error);
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    return successResponse(res, 'All notifications marked as read');
  } catch (error) {
    return errorResponse(res, 'Failed to update notifications', 500, error);
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.notificationId, req.user.id);
    return successResponse(res, 'Notification deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to delete notification', 400, error);
  }
};
