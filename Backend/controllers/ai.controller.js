const aiService = require('../services/ai.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.generateTrip = async (req, res) => {
  try {
    const tripPlan = await aiService.generateTrip(req.user.id, req.body);
    return successResponse(res, 'Trip plan generated successfully', tripPlan);
  } catch (error) {
    return errorResponse(res, 'AI trip generation failed', 500, error);
  }
};

exports.chat = async (req, res) => {
  try {
    const { prompt, tripId } = req.body;
    const response = await aiService.chat(req.user.id, prompt, tripId);
    return successResponse(res, 'AI assistant reply', response);
  } catch (error) {
    return errorResponse(res, 'AI chat failed', 500, error);
  }
};

exports.suggestActivities = async (req, res) => {
  try {
    const suggestions = await aiService.suggestActivities(req.body);
    return successResponse(res, 'AI activity suggestions', suggestions);
  } catch (error) {
    return errorResponse(res, 'AI activity suggestion failed', 500, error);
  }
};

exports.optimizeBudget = async (req, res) => {
  try {
    const optimization = await aiService.optimizeBudget(req.body);
    return successResponse(res, 'AI budget optimization', optimization);
  } catch (error) {
    return errorResponse(res, 'AI budget optimization failed', 500, error);
  }
};

exports.packingSuggestions = async (req, res) => {
  try {
    const suggestions = await aiService.getPackingSuggestions(req.body);
    return successResponse(res, 'AI packing suggestions', suggestions);
  } catch (error) {
    return errorResponse(res, 'AI packing suggestion failed', 500, error);
  }
};

exports.hiddenGems = async (req, res) => {
  try {
    const gems = await aiService.getHiddenGems(req.body);
    return successResponse(res, 'AI hidden gems', gems);
  } catch (error) {
    return errorResponse(res, 'AI hidden gems discovery failed', 500, error);
  }
};

exports.weatherPlanner = async (req, res) => {
  try {
    const plan = await aiService.getWeatherPlanning(req.body);
    return successResponse(res, 'AI weather-aware advice', plan);
  } catch (error) {
    return errorResponse(res, 'AI weather planning failed', 500, error);
  }
};

exports.getHistory = async (req, res) => {
  try {
    const data = await aiService.getHistory(req.user.id, req.query);
    return successResponse(res, 'AI interaction history', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch AI history', 500, error);
  }
};
