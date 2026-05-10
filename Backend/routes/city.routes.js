const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Optional auth helper
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, next);
  }
  next();
};

// Public routes
router.get('/', cityController.getCities);
router.get('/popular', cityController.getPopular);
router.get('/trending', cityController.getTrending);
router.get('/:cityId', cityController.getCityById);
router.get('/:cityId/activities', cityController.getActivities);
router.get('/:cityId/weather', cityController.getWeather);
router.get('/:cityId/budget-insights', cityController.getBudgetInsights);

// Auth optional routes
router.get('/recommended', optionalAuth, cityController.getRecommended);

module.exports = router;
