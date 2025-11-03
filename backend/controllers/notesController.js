const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const Notes = require("../models/notesModel");
const ErrorHandler = require("../utils/errorHandler");

// Create New Note
exports.newNote = asyncErrorHandler(async (req, res, next) => {
  const { title, content, userId } = req.body;
  const note = await Notes.create({ title, content, userId });
  res.status(201).json({ success: true, message: "Note created successfully", note });
});

// Get Single Note
exports.getSingleNote = asyncErrorHandler(async (req, res, next) => {
  const note = await Notes.findById(req.params.id);
  if (!note) {
    return next(new ErrorHandler("Note not found", 404));
  }
  res.status(200).json({ success: true, message: "Note fetched successfully", note });
});

// Delete Note
exports.deleteNote = asyncErrorHandler(async (req, res, next) => {
  const note = await Notes.findByIdAndDelete(req.params.id);
  if (!note) {
    return next(new ErrorHandler("Note not found", 404));
  }
  res.status(204).send();
});

// Get All Notes
exports.getAllNotes = asyncErrorHandler(async (req, res, next) => {
  const notes = await Notes.find();
  res.status(200).json({ success: true, notes });
});

// Update Note
exports.updateNote = asyncErrorHandler(async (req, res, next) => {
  const note = await Notes.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!note) {
    return next(new ErrorHandler("Note not found", 404));
  }
  res.status(200).json({ success: true, note });
});