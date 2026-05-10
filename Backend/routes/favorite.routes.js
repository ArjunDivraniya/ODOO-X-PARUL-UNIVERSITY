const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All favorite routes are protected
router.use(authMiddleware);

router.post('/', favoriteController.addFavorite);
router.get('/', favoriteController.getFavorites);
router.delete('/:favoriteId', favoriteController.removeFavorite);

module.exports = router;
