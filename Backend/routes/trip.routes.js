const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public route must be defined BEFORE the authMiddleware is applied or specific route paths
// @route   GET /api/trips/shared/:shareCode
router.get('/shared/:shareCode', tripController.getSharedTrip);

// Apply authentication middleware to all subsequent routes
router.use(authMiddleware);

// @route   POST /api/trips
router.post('/', upload.single('coverImage'), tripController.createTrip);

// @route   GET /api/trips
router.get('/', tripController.getTrips);

// @route   GET /api/trips/:tripId
router.get('/:tripId', tripController.getTripById);

// @route   PATCH /api/trips/:tripId
router.patch('/:tripId', upload.single('coverImage'), tripController.updateTrip);

// @route   DELETE /api/trips/:tripId
router.delete('/:tripId', tripController.deleteTrip);

// @route   PATCH /api/trips/:tripId/visibility
router.patch('/:tripId/visibility', tripController.updateTripVisibility);

// @route   PATCH /api/trips/:tripId/status
router.patch('/:tripId/status', tripController.updateTripStatus);

// @route   POST /api/trips/:tripId/duplicate
router.post('/:tripId/duplicate', tripController.duplicateTrip);

// @route   POST /api/trips/:tripId/share
router.post('/:tripId/share', tripController.shareTrip);

// @route   GET /api/trips/:tripId/overview
router.get('/:tripId/overview', tripController.getTripOverview);

// @route   GET /api/trips/:tripId/analytics
router.get('/:tripId/analytics', tripController.getTripAnalytics);

module.exports = router;
