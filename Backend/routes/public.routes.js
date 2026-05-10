const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public preview
router.get('/trips/:shareCode', publicController.getPublicTrip);

// Protected duplication
router.post('/trips/:shareCode/copy', authMiddleware, publicController.copyTrip);

module.exports = router;
