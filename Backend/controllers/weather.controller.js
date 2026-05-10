const weatherService = require('../utils/weather.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getCurrentWeather = async (req, res) => {
  try {
    const weather = await weatherService.getCurrentWeather(req.params.city);
    return successResponse(res, 'Weather fetched successfully', { weather });
  } catch (error) {
    return errorResponse(res, error.message, 500, error);
  }
};

exports.getForecast = async (req, res) => {
  try {
    const forecast = await weatherService.getForecast(req.params.city);
    return successResponse(res, 'Forecast fetched successfully', { forecast });
  } catch (error) {
    return errorResponse(res, error.message, 500, error);
  }
};
