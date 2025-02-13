const express = require('express')
const router = express.Router()
const sharedFilesController = require("../controllers/sharedFilesController")
router.post("/shareNote", sharedFilesController.shareNote)
       .get("/getSharedNotes",  sharedFilesController.getSharedNotes)
module.exports = router