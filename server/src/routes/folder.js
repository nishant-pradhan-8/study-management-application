const express = require("express")
const router = express.Router()
const folderControllers = require("../controllers/folderControllers")
router.get("/showFolders",folderControllers.showFolders)
      .get("/frequentlyAccessedFolders", folderControllers.getQuickAccessFolders)
      .post("/createFolder",folderControllers.createFolder)
      .get("/:folderId",folderControllers.showFolderData)
      .patch("/updateFolderAccessCount", folderControllers.countFolderAccess)
      .delete("/deleteFolder", folderControllers.deleteFolder)
    
module.exports = router