const express = require("express");
const { newNote, getSingleNote, getAllNotes, updateNote, deleteNote } = require("../controllers/notesController");

const router = express.Router();

router.route("/").post(newNote);
router.route("/").get(getAllNotes);
router.route("/:id").get(getSingleNote);
router.route("/:id").put(updateNote);
router.route("/:id").delete(deleteNote);

module.exports = router;
