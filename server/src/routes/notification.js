const express = require("express")
const router = express.Router()
const {getNotifications, markNotificationRead} = require("../controllers/notificationControllers")
router.get("/getNotifications", getNotifications).patch("/markNotificatonsRead", markNotificationRead )
module.exports = router