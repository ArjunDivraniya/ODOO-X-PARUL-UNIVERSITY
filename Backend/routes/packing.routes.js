const express = require('express');
const router = express.Router();
const packingController = require('../controllers/packing.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All packing routes are protected
router.use(authMiddleware);

router.post('/', packingController.createItem);
// Specific named paths BEFORE wildcards
router.delete('/reset/:tripId', packingController.resetChecklist);
router.get('/:tripId', packingController.getTripChecklist);
router.patch('/:itemId/toggle', packingController.toggleItem);
router.patch('/:itemId', packingController.updateItem);
router.delete('/:itemId', packingController.deleteItem);

module.exports = router;
