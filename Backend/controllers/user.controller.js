const bcrypt = require('bcryptjs');
const { prisma } = require('../lib/prisma');
const userService = require('../services/user.service');
const { updateProfileSchema } = require('../validators/user.validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @route   GET /api/users/profile
// @desc    Get authenticated user profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const profile = await userService.getProfile(req.user.id);
    return successResponse(res, 'Profile fetched successfully', profile);
  } catch (error) {
    if (error.message === 'User not found') {
      return errorResponse(res, 'User not found', 404);
    }
    return errorResponse(res, 'Failed to fetch profile', 500, error);
  }
};

// @route   PATCH /api/users/profile
// @desc    Update authenticated user profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    // Validate request body
    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message);
      return errorResponse(res, 'Validation failed', 400, errors);
    }

    const updateData = { ...validation.data };

    // Handle stringified JSON fields from FormData
    if (updateData.socialLinks) {
      try { updateData.socialLinks = JSON.parse(updateData.socialLinks); } catch(e) {}
    }
    if (updateData.preferences) {
      try { updateData.preferences = JSON.parse(updateData.preferences); } catch(e) {}
    }

    // Handle Cloudinary Image Uploads
    if (req.files) {
      if (req.files.profileImage) {
        const result = await uploadToCloudinary(req.files.profileImage[0].buffer, 'traveloop/profiles');
        updateData.profileImage = result.secure_url;
      }
      if (req.files.coverImage) {
        const result = await uploadToCloudinary(req.files.coverImage[0].buffer, 'traveloop/covers');
        updateData.coverImage = result.secure_url;
      }
    }

    const updatedUser = await userService.updateProfile(req.user.id, updateData);

    return successResponse(res, 'Profile updated successfully', { user: updatedUser });
  } catch (error) {
    if (error.message === 'Username is already taken') {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, 'Failed to update profile', 500, error);
  }
};

// @route   PATCH /api/users/profile-image
// @desc    Update authenticated user's profile image
// @access  Private
exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Please upload an image file', 400);
    }
    
    const profileImageUrl = await userService.updateProfileImage(req.user.id, req.file.buffer);
    return successResponse(res, 'Profile image updated successfully', { profileImage: profileImageUrl });
  } catch (error) {
    return errorResponse(res, 'Failed to update profile image', 500, error);
  }
};

// @route   PATCH /api/users/cover-image
// @desc    Update authenticated user's cover image
// @access  Private
exports.updateCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Please upload an image file', 400);
    }
    
    const coverImageUrl = await userService.updateCoverImage(req.user.id, req.file.buffer);
    return successResponse(res, 'Cover image updated successfully', { coverImage: coverImageUrl });
  } catch (error) {
    return errorResponse(res, 'Failed to update cover image', 500, error);
  }
};

// @route   GET /api/users/dashboard-stats
// @desc    Fetch dashboard statistics for logged-in user
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await userService.getDashboardStats(req.user.id);
    return successResponse(res, 'Dashboard stats fetched successfully', stats);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch dashboard stats', 500, error);
  }
};

// @route   GET /api/users/activity-summary
// @desc    Fetch user activity overview for dashboard analytics
// @access  Private
exports.getActivitySummary = async (req, res) => {
  try {
    const summary = await userService.getActivitySummary(req.user.id);
    return successResponse(res, 'Activity summary fetched successfully', summary);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch activity summary', 500, error);
  }
};

// @route   GET /api/users/travel-history
// @desc    Fetch complete travel history
// @access  Private
exports.getTravelHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // e.g. COMPLETED
    
    const history = await userService.getTravelHistory(req.user.id, page, limit, status);
    return successResponse(res, 'Travel history fetched successfully', history);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch travel history', 500, error);
  }
};

// @route   GET /api/users/saved-trips
// @desc    Fetch user's bookmarked/saved trips
// @access  Private
exports.getSavedTrips = async (req, res) => {
  try {
    const savedTrips = await userService.getSavedTrips(req.user.id);
    return successResponse(res, 'Saved trips fetched successfully', { savedTrips });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch saved trips', 500, error);
  }
};

// @route   GET /api/users/favorite-places
// @desc    Fetch user's saved favorite destinations
// @access  Private
exports.getFavoritePlaces = async (req, res) => {
  try {
    const favoritePlaces = await userService.getFavoritePlaces(req.user.id);
    return successResponse(res, 'Favorite places fetched successfully', { favoritePlaces });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch favorite places', 500, error);
  }
};

// @route   DELETE /api/users/profile
// @desc    Delete authenticated user account
// @access  Private
exports.deleteProfile = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return errorResponse(res, 'Password confirmation is required to delete account', 400);
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Incorrect password. Account deletion aborted.', 401);
    }

    await userService.deleteAccount(req.user.id);

    return successResponse(res, 'Account deleted successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to delete account', 500, error);
  }
};
