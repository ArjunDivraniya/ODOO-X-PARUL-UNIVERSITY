const uploadService = require('../services/upload.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.uploadSingle = async (req, res) => {
  try {
    const fileData = await uploadService.uploadSingle(req.file);
    return successResponse(res, 'Image uploaded successfully', { file: fileData });
  } catch (error) {
    return errorResponse(res, error.message || 'Upload failed', 400, error);
  }
};

exports.uploadMultiple = async (req, res) => {
  try {
    const filesData = await uploadService.uploadMultiple(req.files);
    return successResponse(res, 'Files uploaded successfully', { files: filesData });
  } catch (error) {
    return errorResponse(res, error.message || 'Bulk upload failed', 400, error);
  }
};

exports.deleteFile = async (req, res) => {
  try {
    await uploadService.deleteFile(req.params.fileId);
    return successResponse(res, 'File deleted successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to delete file', 400, error);
  }
};
