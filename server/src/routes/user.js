const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
router
.get("/userDetails", userController.getUserDetails)
.post("/sendFriendRequest", userController.sendFriendRequest)
.post("/cancelRequestSent", userController.cancelRequestSent)
.post("/respondFriendRequest", userController.respondFriendRequest)
.get("/pendingFriendRequests", userController.getPendingFriendRequests)
.get("/sentFriendRequests", userController.getSentFriendRequests)
.get("/friends", userController.getFriends)
.patch("/updateUserInfo", userController.updateUserInfo)

module.exports = router