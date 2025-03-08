require("dotenv").config();
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
      passReqToCallback: true,

    },
    async function (request, accessToken, refreshToken, profile, done) {
      try{
        let user = await User.findOne({ email: profile.email });
        if (!user) {
          console.log(profile)
          user = await User.create({
            profilePicture: profile.picture,
            firstName: profile.given_name,
            lastName: profile.family_name,
            email: profile.email,
            password: "",
            refreshToken: "",
          });
        }
          const newAccessToken = jwt.sign(
            {
              userId: user._id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
          );
          const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "30d" }
          );
          await User.updateOne({ _id: user._id}, { refreshToken: newRefreshToken });
          return done(null, {user, AccessToken:newAccessToken, RefreshToken:newRefreshToken})
      }catch(error){
        console.error("Error authenticating user:", error);
        return done(error, null);
      }
    
      
    
    }
  )
);
/*
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
*/