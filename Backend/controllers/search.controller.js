const searchService = require('../services/search.service');
const { 
  globalSearchSchema, 
  citySearchSchema, 
  activitySearchSchema, 
  tripSearchSchema 
} = require('../validators/search.validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.globalSearch = async (req, res) => {
  try {
    const validated = globalSearchSchema.parse(req.query);
    const data = await searchService.globalSearch(validated);
    return successResponse(res, 'Global search results', data);
  } catch (error) {
    return errorResponse(res, 'Search failed', 400, error);
  }
};

exports.searchCities = async (req, res) => {
  try {
    const validated = citySearchSchema.parse(req.query);
    const data = await searchService.searchCities(validated);
    return successResponse(res, 'City results', data);
  } catch (error) {
    return errorResponse(res, 'City search failed', 400, error);
  }
};

exports.searchActivities = async (req, res) => {
  try {
    const validated = activitySearchSchema.parse(req.query);
    const data = await searchService.searchActivities(validated);
    return successResponse(res, 'Activity results', data);
  } catch (error) {
    return errorResponse(res, 'Activity search failed', 400, error);
  }
};

exports.searchTrips = async (req, res) => {
  try {
    const validated = tripSearchSchema.parse(req.query);
    const data = await searchService.searchTrips(validated);
    return successResponse(res, 'Trip results', data);
  } catch (error) {
    return errorResponse(res, 'Trip search failed', 400, error);
  }
};

exports.searchCommunity = async (req, res) => {
  try {
    const validated = globalSearchSchema.parse(req.query);
    const data = await searchService.searchCommunity(validated);
    return successResponse(res, 'Community results', data);
  } catch (error) {
    return errorResponse(res, 'Community search failed', 400, error);
  }
};
