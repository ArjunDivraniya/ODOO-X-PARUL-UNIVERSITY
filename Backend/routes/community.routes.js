const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Optional auth helper for feed
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, next);
  }
  next();
};

// Public/Optional routes
router.get('/posts', optionalAuth, communityController.getFeed);
router.get('/posts/:postId', optionalAuth, communityController.getPostById);
router.get('/posts/:postId/comments', communityController.getComments);

// Protected routes
router.use(authMiddleware);

router.post('/posts', upload.array('images', 5), communityController.createPost);
router.patch('/posts/:postId', upload.array('images', 5), communityController.updatePost);
router.delete('/posts/:postId', communityController.deletePost);

// Social Interactions
router.post('/posts/:postId/like', communityController.likePost);
router.delete('/posts/:postId/like', communityController.unlikePost);
router.post('/posts/:postId/comment', communityController.addComment);

module.exports = router;
