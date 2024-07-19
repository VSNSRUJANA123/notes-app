const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  try {
    const { title, content, tags, color, reminder } = req.body;
    const note = new Note({
      userId: req.user.id,
      title,
      content,
      tags,
      color,
      reminder,
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: "Error creating note" });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.id,
      isTrashed: false,
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(400).json({ error: "Error fetching notes" });
  }
};

exports.getNotesByLabel = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.id,
      tags: req.params.label,
      isTrashed: false,
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(400).json({ error: "Error fetching notes by label" });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { title, content, tags, color, reminder } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, tags, color, reminder, updatedAt: Date.now() },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: "Error updating note" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndRemove(req.params.id);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting note" });
  }
};

exports.getArchivedNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.id,
      isArchived: true,
      isTrashed: false,
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(400).json({ error: "Error fetching archived notes" });
  }
};

exports.archiveNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: "Error archiving note" });
  }
};

exports.trashNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { isTrashed: true },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: "Error trashing note" });
  }
};

exports.getTrashedNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.id,
      isTrashed: true,
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(400).json({ error: "Error fetching trashed notes" });
  }
};
