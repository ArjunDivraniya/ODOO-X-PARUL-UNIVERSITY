const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/:tripId', reviewController.getReviews);

router.use(authMiddleware);

router.post('/', reviewController.createReview);
router.patch('/:reviewId', reviewController.updateReview);
router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;
