const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const upload = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/image', upload.single('image'), uploadController.uploadSingle);
router.post('/multiple', upload.array('images', 5), uploadController.uploadMultiple);
router.delete('/:fileId', uploadController.deleteFile);

module.exports = router;
