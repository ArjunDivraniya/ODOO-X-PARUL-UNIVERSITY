const packingService = require('../services/packing.service');
const { packingItemSchema, updatePackingItemSchema } = require('../validators/packing.validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.createItem = async (req, res) => {
  try {
    const validatedData = packingItemSchema.parse(req.body);
    const item = await packingService.createItem(req.user.id, validatedData);
    return successResponse(res, 'Packing item created successfully', { item });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to create packing item', 400, error);
  }
};

exports.getTripChecklist = async (req, res) => {
  try {
    const data = await packingService.getTripChecklist(req.params.tripId, req.user.id, req.query);
    return successResponse(res, 'Packing checklist fetched successfully', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch packing checklist', 500, error);
  }
};

exports.updateItem = async (req, res) => {
  try {
    const validatedData = updatePackingItemSchema.parse(req.body);
    const item = await packingService.updateItem(req.params.itemId, req.user.id, validatedData);
    return successResponse(res, 'Packing item updated successfully', { item });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to update packing item', 400, error);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await packingService.deleteItem(req.params.itemId, req.user.id);
    return successResponse(res, 'Packing item deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to delete packing item', 400, error);
  }
};

exports.toggleItem = async (req, res) => {
  try {
    const item = await packingService.toggleItemStatus(req.params.itemId, req.user.id);
    return successResponse(res, 'Packing status updated successfully', { isPacked: item.isPacked });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to toggle packing status', 400, error);
  }
};

exports.resetChecklist = async (req, res) => {
  try {
    await packingService.resetChecklist(req.params.tripId, req.user.id);
    return successResponse(res, 'Packing checklist reset successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to reset checklist', 400, error);
  }
};
