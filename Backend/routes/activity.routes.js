const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Optional auth helper
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, next);
  }
  next();
};

// Public/Optional routes
router.get('/single/:activityId', optionalAuth, activityController.getActivityById);
router.get('/recommended', activityController.getRecommended);
router.get('/trending', activityController.getTrending);

// Protected routes
router.use(authMiddleware);

router.post('/', activityController.createActivity);
router.get('/:tripId', activityController.getTripActivities);
router.patch('/:activityId', activityController.updateActivity);
router.delete('/:activityId', activityController.deleteActivity);

// Saving/Bookmarking
router.post('/:activityId/save', activityController.saveActivity);
router.delete('/:activityId/save', activityController.unsaveActivity);

module.exports = router;
