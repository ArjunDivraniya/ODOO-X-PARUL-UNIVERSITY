const express = require('express');
const router = express.Router();
const tripSectionController = require('../controllers/tripSection.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   POST /api/trip-sections
router.post('/', tripSectionController.createSection);

// @route   GET /api/trip-sections/:tripId
router.get('/:tripId', tripSectionController.getTripSections);

// @route   GET /api/trip-sections/single/:sectionId
router.get('/single/:sectionId', tripSectionController.getSectionById);

// @route   PATCH /api/trip-sections/:sectionId
router.patch('/:sectionId', tripSectionController.updateSection);

// @route   DELETE /api/trip-sections/:sectionId
router.delete('/:sectionId', tripSectionController.deleteSection);

// @route   PATCH /api/trip-sections/reorder
router.patch('/reorder', tripSectionController.reorderSections);

module.exports = router;
