const favoriteService = require('../services/favorite.service');
const { favoriteSchema } = require('../validators/favorite.validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.addFavorite = async (req, res) => {
  try {
    const { cityId } = favoriteSchema.parse(req.body);
    const favorite = await favoriteService.addFavorite(req.user.id, cityId);
    return successResponse(res, 'Destination added to favorites successfully', { favorite });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to add favorite', 400, error);
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const data = await favoriteService.getFavorites(req.user.id, req.query);
    return successResponse(res, 'Favorites fetched successfully', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch favorites', 500, error);
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    await favoriteService.removeFavorite(req.params.favoriteId, req.user.id);
    return successResponse(res, 'Favorite removed successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to remove favorite', 400, error);
  }
};
