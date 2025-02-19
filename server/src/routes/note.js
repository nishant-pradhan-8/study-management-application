const express = require("express")
const router = express.Router()
const noteControllers = require("../controllers/noteControllers")
const multUpload = require("../middleware/multStorage")
router.post("/uploadNotes",noteControllers.uploadNotes)
      .patch("/updateLastViewed", noteControllers.updateLastViewed)
       .delete("/deleteNote",noteControllers.deleteNote)
       .get("/getLastViewedNotes", noteControllers.getLastViewedNotes)
       .put("/replaceNotes", noteControllers.replaceNotes)


module.exports = router