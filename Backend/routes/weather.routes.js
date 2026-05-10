const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');

router.get('/:city', weatherController.getCurrentWeather);
router.get('/:city/forecast', weatherController.getForecast);

module.exports = router;
