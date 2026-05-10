const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Helper to make auth optional
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, next);
  }
  next();
};

// Public routes
router.get('/cities', recommendationController.searchCities);
router.get('/activities', recommendationController.getActivities);
router.get('/trending', recommendationController.getTrending);
router.get('/nearby', recommendationController.getNearby);
router.get('/budget-friendly', recommendationController.getBudgetFriendly);
router.get('/hidden-gems', recommendationController.getHiddenGems);
router.get('/weather-based', recommendationController.getWeatherBased);
router.get('/popular-destinations', recommendationController.getPopularDestinations);
router.get('/explore', recommendationController.getExplore);
router.get('/similar-cities', recommendationController.getSimilarCities);
router.get('/seasonal', recommendationController.getSeasonal);
router.get('/search', recommendationController.globalSearch);

// Auth optional routes
router.get('/dashboard', optionalAuth, recommendationController.getDashboard);

// Protected routes
router.use(authMiddleware);
router.post('/ai-trip', recommendationController.generateAITrip);
router.post('/ai-activities', recommendationController.generateAIActivities);

module.exports = router;
