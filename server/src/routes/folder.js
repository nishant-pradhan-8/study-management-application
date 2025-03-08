const express = require("express")
const router = express.Router()
const folderControllers = require("../controllers/folderControllers")
router.get("/showFolders",folderControllers.showFolders)
      .get("/frequentlyAccessedFolders", folderControllers.getQuickAccessFolders)
      .get("/folderInfo/:folderId", folderControllers.folderInfo)
      .get("/:folderId",folderControllers.showFolderData)
      .post("/createFolder",folderControllers.createFolder)
      .patch("/updateFolderAccessCount", folderControllers.countFolderAccess)
      .patch("/renameFolder", folderControllers.renameFolder)
      .delete("/deleteFolders", folderControllers.deleteFolders)
      
    
module.exports = router