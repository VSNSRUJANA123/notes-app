const express = require("express");
const router = express.Router();
const NoteController = require("../controllers/noteController");
const passport = require("passport");

require("../config/passport")(passport); // Correct path to the passport config file
const auth = passport.authenticate("jwt", { session: false });

router.post("/", auth, NoteController.createNote);
router.get("/", auth, NoteController.getNotes);
router.get("/label/:label", auth, NoteController.getNotesByLabel);
router.put("/:id", auth, NoteController.updateNote);
router.delete("/:id", auth, NoteController.deleteNote);
router.get("/archived", auth, NoteController.getArchivedNotes);
router.put("/archive/:id", auth, NoteController.archiveNote);
router.put("/trash/:id", auth, NoteController.trashNote);
router.get("/trash", auth, NoteController.getTrashedNotes);

module.exports = router;
