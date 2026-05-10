const communityService = require('../services/community.service');
const { postSchema, updatePostSchema, commentSchema } = require('../validators/community.validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.createPost = async (req, res) => {
  try {
    const validatedData = postSchema.parse(req.body);
    const files = req.files || [];
    const post = await communityService.createPost(req.user.id, validatedData, files);
    return successResponse(res, 'Post created successfully', { post });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to create post', 400, error);
  }
};

exports.getFeed = async (req, res) => {
  try {
    const data = await communityService.getFeed(req.query, req.user?.id);
    return successResponse(res, 'Community feed fetched successfully', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch feed', 500, error);
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await communityService.getPostById(req.params.postId, req.user?.id);
    return successResponse(res, 'Post details fetched successfully', { post });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch post', 404, error);
  }
};

exports.updatePost = async (req, res) => {
  try {
    const validatedData = updatePostSchema.parse(req.body);
    const files = req.files || [];
    const post = await communityService.updatePost(req.params.postId, req.user.id, validatedData, files);
    return successResponse(res, 'Post updated successfully', { post });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to update post', 400, error);
  }
};

exports.deletePost = async (req, res) => {
  try {
    await communityService.deletePost(req.params.postId, req.user.id);
    return successResponse(res, 'Post deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to delete post', 400, error);
  }
};

exports.likePost = async (req, res) => {
  try {
    await communityService.likePost(req.user.id, req.params.postId);
    return successResponse(res, 'Post liked successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to like post', 500, error);
  }
};

exports.unlikePost = async (req, res) => {
  try {
    await communityService.unlikePost(req.user.id, req.params.postId);
    return successResponse(res, 'Like removed successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to remove like', 500, error);
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = commentSchema.parse(req.body);
    const comment = await communityService.addComment(req.user.id, req.params.postId, content);
    return successResponse(res, 'Comment added successfully', { comment });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to add comment', 400, error);
  }
};

exports.getComments = async (req, res) => {
  try {
    const data = await communityService.getComments(req.params.postId, req.query);
    return successResponse(res, 'Comments fetched successfully', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch comments', 500, error);
  }
};
