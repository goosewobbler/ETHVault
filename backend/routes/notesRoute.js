const express = require("express");
const { newNote, getSingleNote, getAllNotes, updateNote, deleteNote } = require("../controllers/noteController");

const router = express.Router();

router.route("/notes").post(newNote);
router.route("/notes/:id").get(getSingleNote);

router
  .route("/notes")
  .get(getAllNotes);

router
  .route("/notes/:id")
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;
