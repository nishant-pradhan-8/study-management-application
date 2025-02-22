const express = require("express")
const router = express.Router()
const authController = require("../controllers/authControllers")
router.post("/register",authController.registerUser)
.post("/login",authController.loginUser)
module.exports = router