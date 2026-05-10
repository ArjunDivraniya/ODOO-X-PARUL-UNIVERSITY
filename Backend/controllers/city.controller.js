const cityService = require('../services/city.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getCities = async (req, res) => {
  try {
    const data = await cityService.getCities(req.query);
    return successResponse(res, 'Cities fetched successfully', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch cities', 500, error);
  }
};

exports.getCityById = async (req, res) => {
  try {
    const city = await cityService.getCityById(req.params.cityId);
    return successResponse(res, 'City details fetched successfully', { city });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch city details', 404, error);
  }
};

exports.getPopular = async (req, res) => {
  try {
    const popularCities = await cityService.getPopularCities();
    return successResponse(res, 'Popular cities fetched successfully', { popularCities });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch popular cities', 500, error);
  }
};

exports.getTrending = async (req, res) => {
  try {
    const trendingCities = await cityService.getTrendingCities();
    return successResponse(res, 'Trending cities fetched successfully', { trendingCities });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch trending cities', 500, error);
  }
};

exports.getRecommended = async (req, res) => {
  try {
    const recommendedCities = await cityService.getRecommendedCities(req.user?.id);
    return successResponse(res, 'Recommended cities fetched successfully', { recommendedCities });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch recommended cities', 500, error);
  }
};

exports.getActivities = async (req, res) => {
  try {
    const activities = await cityService.getCityActivities(req.params.cityId, req.query);
    return successResponse(res, 'City activities fetched successfully', { activities });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch city activities', 500, error);
  }
};

exports.getWeather = async (req, res) => {
  try {
    const weather = await cityService.getCityWeather(req.params.cityId);
    return successResponse(res, 'City weather fetched successfully', { weather });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch city weather', 500, error);
  }
};

exports.getBudgetInsights = async (req, res) => {
  try {
    const budgetInsights = await cityService.getBudgetInsights(req.params.cityId);
    return successResponse(res, 'City budget insights fetched successfully', { budgetInsights });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch city budget insights', 500, error);
  }
};
