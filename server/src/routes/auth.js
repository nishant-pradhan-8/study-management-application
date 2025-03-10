const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const passport = require("passport");

router
  .post("/register", authController.registerUser)
  .post("/login", authController.loginUser)
  .post("/logout", authController.logoutUser)
  .post("/refresh", authController.refresh)
  .get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  )
  .get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "https://study-management-web-app.onrender.com/login",
      session: false,
    }),
    authController.googleAuth
  );
module.exports = router;
