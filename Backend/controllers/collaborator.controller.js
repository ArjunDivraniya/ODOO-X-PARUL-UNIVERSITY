const collaboratorService = require('../services/collaborator.service');
const { inviteCollaboratorSchema, updatePermissionSchema } = require('../validators/collaborator.validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.inviteCollaborator = async (req, res) => {
  try {
    const validatedData = inviteCollaboratorSchema.parse(req.body);
    const collaborator = await collaboratorService.inviteCollaborator(req.user.id, validatedData);
    return successResponse(res, 'Collaborator invited successfully', { collaborator });
  } catch (error) {
    return errorResponse(res, error.message || 'Invitation failed', 400, error);
  }
};

exports.getCollaborators = async (req, res) => {
  try {
    const collaborators = await collaboratorService.getCollaborators(req.params.tripId, req.user.id);
    return successResponse(res, 'Collaborators fetched successfully', { collaborators });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch collaborators', 400, error);
  }
};

exports.updatePermission = async (req, res) => {
  try {
    const { permission } = updatePermissionSchema.parse(req.body);
    const collaborator = await collaboratorService.updatePermission(req.params.collaboratorId, req.user.id, permission);
    return successResponse(res, 'Permission updated successfully', { collaborator });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to update permission', 400, error);
  }
};

exports.removeCollaborator = async (req, res) => {
  try {
    await collaboratorService.removeCollaborator(req.params.collaboratorId, req.user.id);
    return successResponse(res, 'Collaborator removed successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to remove collaborator', 400, error);
  }
};
