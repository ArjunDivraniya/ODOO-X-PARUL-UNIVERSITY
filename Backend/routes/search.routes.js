const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

router.get('/global', searchController.globalSearch);
router.get('/cities', searchController.searchCities);
router.get('/activities', searchController.searchActivities);
router.get('/trips', searchController.searchTrips);
router.get('/community', searchController.searchCommunity);

module.exports = router;
