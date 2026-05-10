const express = require('express');
const router = express.Router();
const collaboratorController = require('../controllers/collaborator.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/invite', collaboratorController.inviteCollaborator);
router.get('/:tripId', collaboratorController.getCollaborators);
router.patch('/:collaboratorId/permission', collaboratorController.updatePermission);
router.delete('/:collaboratorId', collaboratorController.removeCollaborator);

module.exports = router;
