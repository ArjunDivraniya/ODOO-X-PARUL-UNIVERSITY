const reviewService = require('../services/review.service');
const { createReviewSchema, updateReviewSchema } = require('../validators/review.validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.createReview = async (req, res) => {
  try {
    const validatedData = createReviewSchema.parse(req.body);
    const review = await reviewService.createReview(req.user.id, validatedData);
    return successResponse(res, 'Review created successfully', { review });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to create review', 400, error);
  }
};

exports.getReviews = async (req, res) => {
  try {
    const data = await reviewService.getReviews(req.params.tripId, req.query);
    return successResponse(res, 'Reviews fetched successfully', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch reviews', 500, error);
  }
};

exports.updateReview = async (req, res) => {
  try {
    const validatedData = updateReviewSchema.parse(req.body);
    const review = await reviewService.updateReview(req.params.reviewId, req.user.id, validatedData);
    return successResponse(res, 'Review updated successfully', { review });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to update review', 400, error);
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.reviewId, req.user.id);
    return successResponse(res, 'Review deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to delete review', 400, error);
  }
};
