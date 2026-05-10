const tripService = require('../services/trip.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { createTripSchema, updateTripSchema, updateVisibilitySchema, updateStatusSchema, generateAITripSchema } = require('../validators/trip.validator');

exports.createTrip = async (req, res) => {
  try {
    const validatedData = createTripSchema.parse({ body: req.body }).body;
    const trip = await tripService.createTrip(req.user.id, validatedData, req.file ? req.file.buffer : null);
    return successResponse(res, 'Trip created successfully', { trip }, 201);
  } catch (error) {
    return errorResponse(res, 'Failed to create trip', 400, error);
  }
};

exports.getTrips = async (req, res) => {
  try {
    const result = await tripService.getTrips(req.user.id, req.query);
    return successResponse(res, 'Trips fetched successfully', result);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch trips', 500, error);
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await tripService.getTripById(req.params.tripId, req.user.id);
    return successResponse(res, 'Trip details fetched successfully', { trip });
  } catch (error) {
    if (error.message.includes('Unauthorized')) return errorResponse(res, error.message, 403);
    return errorResponse(res, 'Failed to fetch trip', 404, error);
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const validatedData = updateTripSchema.parse({ body: req.body }).body;
    const trip = await tripService.updateTrip(req.params.tripId, req.user.id, validatedData, req.file ? req.file.buffer : null);
    return successResponse(res, 'Trip updated successfully', { trip });
  } catch (error) {
    if (error.message.includes('Unauthorized')) return errorResponse(res, error.message, 403);
    return errorResponse(res, 'Failed to update trip', 400, error);
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    await tripService.deleteTrip(req.params.tripId, req.user.id);
    return successResponse(res, 'Trip deleted successfully');
  } catch (error) {
    if (error.message.includes('Unauthorized')) return errorResponse(res, error.message, 403);
    return errorResponse(res, 'Failed to delete trip', 400, error);
  }
};

exports.updateTripVisibility = async (req, res) => {
  try {
    const validatedData = updateVisibilitySchema.parse({ body: req.body }).body;
    const trip = await tripService.updateTripVisibility(req.params.tripId, req.user.id, validatedData.visibility);
    return successResponse(res, 'Trip visibility updated', { visibility: trip.visibility, shareCode: trip.shareCode });
  } catch (error) {
    if (error.message.includes('Unauthorized')) return errorResponse(res, error.message, 403);
    return errorResponse(res, 'Failed to update visibility', 400, error);
  }
};

exports.updateTripStatus = async (req, res) => {
  try {
    const validatedData = updateStatusSchema.parse({ body: req.body }).body;
    const trip = await tripService.updateTripStatus(req.params.tripId, req.user.id, validatedData.status);
    return successResponse(res, 'Trip status updated', { status: trip.status });
  } catch (error) {
    if (error.message.includes('Unauthorized')) return errorResponse(res, error.message, 403);
    return errorResponse(res, 'Failed to update status', 400, error);
  }
};

exports.duplicateTrip = async (req, res) => {
  try {
    const trip = await tripService.duplicateTrip(req.params.tripId, req.user.id);
    return successResponse(res, 'Trip duplicated successfully', { trip }, 201);
  } catch (error) {
    if (error.message.includes('Unauthorized')) return errorResponse(res, error.message, 403);
    return errorResponse(res, 'Failed to duplicate trip', 400, error);
  }
};

exports.shareTrip = async (req, res) => {
  try {
    const shareCode = await tripService.shareTrip(req.params.tripId, req.user.id);
    return successResponse(res, 'Trip share link generated', { 
      shareUrl: `${process.env.CLIENT_URL}/shared/${shareCode}`,
      shareCode
    });
  } catch (error) {
    if (error.message.includes('Unauthorized')) return errorResponse(res, error.message, 403);
    return errorResponse(res, 'Failed to share trip', 400, error);
  }
};

exports.getSharedTrip = async (req, res) => {
  try {
    const trip = await tripService.getSharedTrip(req.params.shareCode);
    return successResponse(res, 'Shared trip fetched successfully', { trip });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch shared trip', 404, error);
  }
};

exports.getTripOverview = async (req, res) => {
  try {
    const overview = await tripService.getTripOverview(req.params.tripId, req.user.id);
    return successResponse(res, 'Trip overview fetched', { overview });
  } catch (error) {
    if (error.message.includes('Unauthorized')) return errorResponse(res, error.message, 403);
    return errorResponse(res, 'Failed to fetch trip overview', 400, error);
  }
};

exports.getTripAnalytics = async (req, res) => {
  try {
    const analytics = await tripService.getTripAnalytics(req.params.tripId, req.user.id);
    return successResponse(res, 'Trip analytics fetched', { analytics });
  } catch (error) {
    if (error.message.includes('Unauthorized')) return errorResponse(res, error.message, 403);
    return errorResponse(res, 'Failed to fetch analytics', 400, error);
  }
};

exports.generateAITrip = async (req, res) => {
  try {
    const validatedData = generateAITripSchema.parse({ body: req.body }).body;
    const trip = await tripService.generateAITrip(req.user.id, validatedData);
    return successResponse(res, 'AI Trip generated successfully', { trip }, 201);
  } catch (error) {
    console.error('AI Generation Error:', error.message);
    return errorResponse(res, error.message || 'Failed to generate AI trip', 400, error);
  }
};
