const express = require("express");
const router = express.Router();
const noteControllers = require("../controllers/noteControllers");
router
  .post("/uploadNotes", noteControllers.uploadNotes)
  .patch("/updateLastViewed", noteControllers.updateLastViewed)
  .delete("/deleteNote", noteControllers.deleteNotes)
  .get("/noteInfo/:noteId", noteControllers.noteInfo)
  .get("/getLastViewedNotes", noteControllers.getLastViewedNotes)
  .put("/replaceNotes", noteControllers.replaceNotes);

module.exports = router;
