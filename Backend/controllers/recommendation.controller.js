const recommendationService = require('../services/recommendation.service');
const aiService = require('../utils/ai.service');
const { prisma } = require('../lib/prisma');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getDashboard = async (req, res) => {
  try {
    const data = await recommendationService.getDashboardRecommendations(req.user?.id);
    return successResponse(res, 'Dashboard recommendations fetched', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch dashboard recommendations', 500, error);
  }
};

exports.searchCities = async (req, res) => {
  try {
    const { search } = req.query;
    const data = await recommendationService.searchCities(search);
    return successResponse(res, 'City suggestions fetched', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch city suggestions', 500, error);
  }
};

exports.getActivities = async (req, res) => {
  try {
    const { city, category } = req.query;
    if (!city) return errorResponse(res, 'City is required', 400);
    const activities = await recommendationService.getActivities(city, category);
    return successResponse(res, 'Activity recommendations fetched', { activities });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch activity recommendations', 500, error);
  }
};

exports.getTrending = async (req, res) => {
  try {
    const data = await recommendationService.getTrending();
    return successResponse(res, 'Trending destinations fetched', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch trending data', 500, error);
  }
};

exports.getNearby = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return errorResponse(res, 'City is required', 400);
    // Suggesting similar cities as "nearby" in a travel context
    const nearbyPlaces = await aiService._callAI(`Suggest 5 cities near or similar to ${city} for a trip. Return JSON array: [{"name": "", "country": "", "distance": ""}]`);
    return successResponse(res, 'Nearby places fetched', { nearbyPlaces });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch nearby places', 500, error);
  }
};

exports.generateAITrip = async (req, res) => {
  try {
    const { budget, days, tripType, interests } = req.body;
    const recommendation = await aiService.generateTripRecommendation(budget, days, tripType, interests);
    return successResponse(res, 'AI trip recommendation generated', { recommendation });
  } catch (error) {
    return errorResponse(res, 'Failed to generate AI trip', 500, error);
  }
};

exports.generateAIActivities = async (req, res) => {
  try {
    const { city, interests } = req.body;
    const recommendations = await aiService.suggestActivities(city, interests);
    return successResponse(res, 'AI activity suggestions generated', { recommendations });
  } catch (error) {
    return errorResponse(res, 'Failed to generate AI activities', 500, error);
  }
};

exports.getBudgetFriendly = async (req, res) => {
  try {
    const budget = parseFloat(req.query.budget) || 50000;
    const cities = await prisma.city.findMany({
      where: { averageBudget: { lte: budget } },
      orderBy: { averageBudget: 'asc' },
      take: 10
    });
    return successResponse(res, 'Budget-friendly destinations fetched', { cities });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch budget-friendly destinations', 500, error);
  }
};

exports.getHiddenGems = async (req, res) => {
  try {
    const gems = await aiService.findHiddenGems();
    return successResponse(res, 'Hidden gems fetched', { gems });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch hidden gems', 500, error);
  }
};

exports.getWeatherBased = async (req, res) => {
  try {
    const { weather } = req.query;
    const suggestions = await recommendationService.getWeatherBased(weather);
    return successResponse(res, 'Weather-based recommendations fetched', { suggestions });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch weather-based recommendations', 500, error);
  }
};

exports.getPopularDestinations = async (req, res) => {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { popularityScore: 'desc' },
      take: 15
    });
    return successResponse(res, 'Popular destinations fetched', { cities });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch popular destinations', 500, error);
  }
};

exports.getExplore = async (req, res) => {
  try {
    const data = await recommendationService.explore();
    return successResponse(res, 'Explore data fetched', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch explore data', 500, error);
  }
};

exports.getSimilarCities = async (req, res) => {
  try {
    const { city } = req.query;
    const similar = await aiService._callAI(`Suggest 5 cities similar to ${city} in terms of vibe and attractions. Return JSON array: [{"name": "", "country": "", "matchReason": ""}]`);
    return successResponse(res, 'Similar cities fetched', { similar });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch similar cities', 500, error);
  }
};

exports.getSeasonal = async (req, res) => {
  try {
    const { season } = req.query;
    const recommendations = await recommendationService.getSeasonalRecommendations(season);
    return successResponse(res, 'Seasonal recommendations fetched', { recommendations });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch seasonal recommendations', 500, error);
  }
};

exports.globalSearch = async (req, res) => {
  try {
    const { query } = req.query;
    const [cities, activities, trips] = await Promise.all([
      prisma.city.findMany({ where: { name: { contains: query, mode: 'insensitive' } }, take: 5 }),
      prisma.globalActivity.findMany({ where: { title: { contains: query, mode: 'insensitive' } }, take: 5 }),
      prisma.trip.findMany({ where: { title: { contains: query, mode: 'insensitive' }, visibility: 'PUBLIC' }, take: 5 })
    ]);
    return successResponse(res, 'Search results fetched', { cities, activities, trips });
  } catch (error) {
    return errorResponse(res, 'Search failed', 500, error);
  }
};
