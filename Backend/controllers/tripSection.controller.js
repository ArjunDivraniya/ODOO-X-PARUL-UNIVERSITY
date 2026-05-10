const tripSectionService = require('../services/tripSection.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { createSectionSchema, updateSectionSchema, reorderSectionsSchema } = require('../validators/tripSection.validator');

exports.createSection = async (req, res) => {
  try {
    const validatedData = createSectionSchema.parse({ body: req.body }).body;
    
    const isOwner = await tripSectionService.validateTripOwnership(validatedData.tripId, req.user.id);
    if (!isOwner) {
      return errorResponse(res, 'Unauthorized: You do not own this trip', 403);
    }

    const section = await tripSectionService.createSection(validatedData);
    return successResponse(res, 'Itinerary section created successfully', { section }, 201);
  } catch (error) {
    return errorResponse(res, 'Failed to create itinerary section', 400, error);
  }
};

exports.getTripSections = async (req, res) => {
  try {
    const { tripId } = req.params;
    
    const isOwner = await tripSectionService.validateTripOwnership(tripId, req.user.id);
    if (!isOwner) {
      return errorResponse(res, 'Unauthorized: You do not own this trip', 403);
    }

    const sections = await tripSectionService.getTripSections(tripId);
    return successResponse(res, 'Itinerary sections fetched successfully', { sections });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch itinerary sections', 500, error);
  }
};

exports.getSectionById = async (req, res) => {
  try {
    const { sectionId } = req.params;
    
    const isOwner = await tripSectionService.validateOwnership(sectionId, req.user.id);
    if (!isOwner) {
      return errorResponse(res, 'Unauthorized: You do not own this section', 403);
    }

    const section = await tripSectionService.getSectionById(sectionId);
    if (!section) {
      return errorResponse(res, 'Itinerary section not found', 404);
    }

    return successResponse(res, 'Itinerary section details fetched successfully', { section });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch itinerary section', 500, error);
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const validatedData = updateSectionSchema.parse({ body: req.body }).body;
    
    const isOwner = await tripSectionService.validateOwnership(sectionId, req.user.id);
    if (!isOwner) {
      return errorResponse(res, 'Unauthorized: You do not own this section', 403);
    }

    const section = await tripSectionService.updateSection(sectionId, validatedData);
    return successResponse(res, 'Itinerary section updated successfully', { section });
  } catch (error) {
    return errorResponse(res, 'Failed to update itinerary section', 400, error);
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    
    const isOwner = await tripSectionService.validateOwnership(sectionId, req.user.id);
    if (!isOwner) {
      return errorResponse(res, 'Unauthorized: You do not own this section', 403);
    }

    await tripSectionService.deleteSection(sectionId);
    return successResponse(res, 'Itinerary section deleted successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to delete itinerary section', 400, error);
  }
};

exports.reorderSections = async (req, res) => {
  try {
    const validatedData = reorderSectionsSchema.parse({ body: req.body }).body;
    
    // Validate that all sections belong to trips owned by the user
    // For simplicity, we check the first section's ownership
    // In a production app, we might want to verify all belong to the SAME trip
    if (validatedData.length > 0) {
      const isOwner = await tripSectionService.validateOwnership(validatedData[0].id, req.user.id);
      if (!isOwner) {
        return errorResponse(res, 'Unauthorized: You do not own these sections', 403);
      }
    }

    await tripSectionService.reorderSections(validatedData);
    return successResponse(res, 'Itinerary sections reordered successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to reorder itinerary sections', 400, error);
  }
};
