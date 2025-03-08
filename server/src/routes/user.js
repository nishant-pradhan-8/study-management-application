const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
router
  .get("/userDetails", userController.getUserDetails)
  .post("/sendFriendRequest", userController.sendFriendRequest)
  .delete("/cancelRequestSent", userController.cancelRequestSent)
  .patch("/respondFriendRequest", userController.respondFriendRequest)
  .get("/pendingFriendRequests", userController.getPendingFriendRequests)
  .get("/sentFriendRequests", userController.getSentFriendRequests)
  .get("/friends", userController.getFriends)
  .patch("/updateUserInfo", userController.updateUserInfo)
  .delete("/removeFriend", userController.deleteFriend)

module.exports = router;
