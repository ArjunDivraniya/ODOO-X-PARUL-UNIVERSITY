const noteService = require('../services/note.service');
const { noteSchema, updateNoteSchema } = require('../validators/note.validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.createNote = async (req, res) => {
  try {
    const validatedData = noteSchema.parse(req.body);
    const files = req.files || [];
    const note = await noteService.createNote(req.user.id, validatedData, files);
    return successResponse(res, 'Note created successfully', { note });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to create note', 400, error);
  }
};

exports.getTripNotes = async (req, res) => {
  try {
    const data = await noteService.getTripNotes(req.params.tripId, req.user.id, req.query);
    return successResponse(res, 'Trip notes fetched successfully', data);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch notes', 500, error);
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await noteService.getNoteById(req.params.noteId, req.user.id);
    return successResponse(res, 'Note details fetched successfully', { note });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch note details', 404, error);
  }
};

exports.updateNote = async (req, res) => {
  try {
    const validatedData = updateNoteSchema.parse(req.body);
    const files = req.files || [];
    const note = await noteService.updateNote(req.params.noteId, req.user.id, validatedData, files);
    return successResponse(res, 'Note updated successfully', { note });
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to update note', 400, error);
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await noteService.deleteNote(req.params.noteId, req.user.id);
    return successResponse(res, 'Note deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to delete note', 400, error);
  }
};

exports.getNotesByDay = async (req, res) => {
  try {
    const days = await noteService.getNotesByDay(req.params.tripId, req.user.id);
    return successResponse(res, 'Notes grouped by day fetched', { days });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch grouped notes', 500, error);
  }
};

exports.getNotesBySection = async (req, res) => {
  try {
    const sections = await noteService.getNotesBySection(req.params.tripId, req.user.id);
    return successResponse(res, 'Notes grouped by section fetched', { sections });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch grouped notes', 500, error);
  }
};
