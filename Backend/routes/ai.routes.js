const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const authMiddleware = require('../middleware/auth.middleware');

// AI routes are protected
router.use(authMiddleware);

router.post('/generate-trip', aiController.generateTrip);
router.post('/chat', aiController.chat);
router.post('/suggest-activities', aiController.suggestActivities);
router.post('/budget-optimizer', aiController.optimizeBudget);
router.post('/packing-suggestions', aiController.packingSuggestions);
router.post('/hidden-gems', aiController.hiddenGems);
router.post('/weather-planner', aiController.weatherPlanner);
router.get('/history', aiController.getHistory);

module.exports = router;
