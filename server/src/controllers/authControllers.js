const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { registrationInfo } = req.body;
    const { firstName, lastName, email, password } = registrationInfo;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        status: "error",
        message: "Email is already registered!",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      profilePicture: "",
      firstName,
      lastName,
      email,
      password: hashedPassword,
      refreshToken: "",
    });
    const userId = newUser._id;

    const accessToken = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    await User.updateOne({ _id: userId }, { refreshToken });

    res.cookie("accessToken", accessToken, {
      httpOnly: process.env.NODE_ENV !== "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: process.env.NODE_ENV !== "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      status: "success",
      message: "User Created SuccessFully",
      data: null,
    });

  } catch (e) {
    return res.status(500).json({
      status: "error",
      message: "Unexpected Error Occurred. Please Try again",
      data: null,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { loginInfo } = req.body;
    const { email, password } = loginInfo;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Email is not registered. Please Create an Account",
        data: null,
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: "error",
        message: "Incorrect Password. Please Try Again.",
        data: null,
      });
    }
    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    await user.updateOne({ email }, { refreshToken });

    res.cookie("accessToken", accessToken, {
      httpOnly: process.env.NODE_ENV !== "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly:  process.env.NODE_ENV !== "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ status: "success", message: "Login Successfull", data: null });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error", data: null });
  }
};

const logoutUser = async (req, res) => {
  try {
    const userId = req.userId;

    await User.updateOne({ userId }, { refreshToken: "" });
    
    res.clearCookie('accessToken');

    res.clearCookie('refreshToken');
    
    return res.status(200).json({
      status: "success",
      message: "User logged Out Successfully.",
      data: null,
    });
  } catch (e) {

    return res.status(500).json({
      status: "error",
      message: "Unexpected Error Occurred. Please Try again",
      data: null,
    });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        status: "error",
        message: "Refresh Token Missing.",
        data: null,
      });
    }

    const user = await User.findOne({ refreshToken });

    if (!user){
      return res
      .status(403)
      .json({ status: "error", message: "User Not Found.", data: null });
    }
    
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          await User.updateOne({ refreshToken }, { refreshToken: "" });

          res.clearCookie('accessToken');
           res.clearCookie('refreshToken');

          if (err.name === "TokenExpiredError") {
            return res.status(401).json({
              status: "error",
              message: "Access token expired. Please refresh your token.",
              data: null,
            });
          }

          return res
            .status(403)
            .json({ status: "error", message: "Invalid token", data: null });
        }
        const userId = decoded.userId;

        const accessToken = jwt.sign(
          { userId },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("accessToken", accessToken, {
          httpOnly:  process.env.NODE_ENV !== "production",
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          maxAge: 60 * 60 * 1000,
        });

        return res.status(200).json({
          status: "success",
          message: "Access Token Refreshed Successfully.",
          data: null,
        });
      }
    );
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Errors.",
      data: null,
    });
  }
};

const googleAuth = async (req, res) => {
  const { AccessToken, RefreshToken } = req.user;

  res.cookie("accessToken", AccessToken, {
    httpOnly: process.env.NODE_ENV !== "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", RefreshToken, {
    httpOnly: process.env.NODE_ENV !== "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  
  res.redirect("http://localhost:3000/");
};

module.exports = { registerUser, loginUser, refresh, logoutUser, googleAuth };
