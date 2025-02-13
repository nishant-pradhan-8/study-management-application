const express = require("express")
const router = express.Router()
const folderControllers = require("../controllers/folderControllers")
router.get("/showFolders",folderControllers.showFolders)
      .post("/createFolder",folderControllers.createFolder)
      .get("/:folderId",folderControllers.showFolderData)
module.exports = router