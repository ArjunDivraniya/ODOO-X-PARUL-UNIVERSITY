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

// @route   DELETE /api/users/profile
router.delete('/profile', userController.deleteProfile);

module.exports = router;
