const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/users/profile
router.get('/profile', userController.getProfile);

// @route   PATCH /api/users/profile
router.patch('/profile', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), userController.updateProfile);

// @route   PATCH /api/users/profile-image
router.patch('/profile-image', upload.single('profileImage'), userController.updateProfileImage);

// @route   PATCH /api/users/cover-image
router.patch('/cover-image', upload.single('coverImage'), userController.updateCoverImage);

// @route   GET /api/users/dashboard-stats
router.get('/dashboard-stats', userController.getDashboardStats);

// @route   GET /api/users/activity-summary
router.get('/activity-summary', userController.getActivitySummary);

// @route   GET /api/users/travel-history
router.get('/travel-history', userController.getTravelHistory);

// @route   GET /api/users/saved-trips
router.get('/saved-trips', userController.getSavedTrips);

// @route   GET /api/users/favorite-places
router.get('/favorite-places', userController.getFavoritePlaces);

// @route   DELETE /api/users/profile
router.delete('/profile', userController.deleteProfile);

module.exports = router;
