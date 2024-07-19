const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  color: { type: String, default: "white" },
  isArchived: { type: Boolean, default: false },
  isTrashed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  reminder: { type: Date },
});

module.exports = mongoose.model("Note", NoteSchema);
