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

// Public / optional-auth routes
router.get('/posts', optionalAuth, communityController.getFeed);
router.get('/posts/:postId', optionalAuth, communityController.getPostById);
router.get('/posts/:postId/comments', communityController.getComments);

// Protected routes
router.use(authMiddleware);

// Post CRUD — accept both single "image" and multi "images" field names
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]);

router.post('/posts', uploadFields, communityController.createPost);
router.patch('/posts/:postId', uploadFields, communityController.updatePost);
router.delete('/posts/:postId', communityController.deletePost);

// Social interactions
router.post('/posts/:postId/like', communityController.likePost);
router.delete('/posts/:postId/like', communityController.unlikePost);
router.post('/posts/:postId/comment', communityController.addComment);

// Trip actions on community posts
router.post('/posts/:postId/save-trip', communityController.savePostTrip);
router.post('/posts/:postId/copy-trip', communityController.copyPostTrip);

module.exports = router;
