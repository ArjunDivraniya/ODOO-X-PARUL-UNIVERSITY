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
