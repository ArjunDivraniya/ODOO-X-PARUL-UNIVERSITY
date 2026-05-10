const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/user', authMiddleware, analyticsController.getUserAnalytics);
router.get('/trip/:tripId', authMiddleware, analyticsController.getTripAnalytics);
router.get('/community', analyticsController.getCommunityAnalytics);

module.exports = router;
