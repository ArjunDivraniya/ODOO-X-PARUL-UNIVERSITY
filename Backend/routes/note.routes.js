const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// All note routes are protected
router.use(authMiddleware);

// CRUD
router.post('/', upload.array('attachments', 5), noteController.createNote);
router.get('/:tripId', noteController.getTripNotes);
router.get('/single/:noteId', noteController.getNoteById);
router.patch('/:noteId', upload.array('attachments', 5), noteController.updateNote);
router.delete('/:noteId', noteController.deleteNote);

// Grouping
router.get('/:tripId/by-day', noteController.getNotesByDay);
router.get('/:tripId/by-section', noteController.getNotesBySection);

module.exports = router;
