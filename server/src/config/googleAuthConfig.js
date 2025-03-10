require("dotenv").config();
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://study-management-application.onrender.com/api/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ email: profile.email });

        if (!user) {
          user = await User.create({
            profilePicture: profile.picture,
            firstName: profile.given_name,
            lastName: profile.family_name,
            email: profile.email,
            password: "",
            refreshToken: [],
          });
        }

        const newAccessToken = jwt.sign(
          {
            userId: user._id,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        const newRefreshToken = jwt.sign(
          { userId: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

        const deviceId = crypto.randomUUID();

        const refreshObj = {
          token: hashedRefreshToken,
          deviceId,
          createdAt: new Date(),
        };

        await User.updateOne(
          { _id: user._id },
          { $push: { refreshToken: refreshObj } }
        );

        return done(null, {
          user,
          AccessToken: newAccessToken,
          RefreshToken: newRefreshToken,
          deviceId,
        });
      } catch (error) {
        console.error("Error authenticating user:", error);
        return done(error, null);
      }
    }
  )
);
