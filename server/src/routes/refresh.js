const express = require("express")
const router = express.Router()
const refreshAccessToken = require("../controllers/refreshController")
router.post("/",refreshAccessToken)
module.exports = router