const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
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
      refreshToken: [],
    });
    const userId = newUser._id;

    const accessToken = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken,10);
    const deviceId = crypto.randomUUID()
    const refreshObj = {
      token:hashedRefreshToken,
      deviceId,
      createdAt: new Date()
    }
  
  
    await User.updateOne({ _id: userId }, { $push:{refreshToken:refreshObj} });

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

    
    res.cookie("deviceId", deviceId, {
      httpOnly: process.env.NODE_ENV !== "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

     
    const userInfo = {
      _id:userId,
      profilePicture:newUser.profilePicture,
      firstName:newUser.firstName,
      lastName:newUser.lastName,
      email:newUser.email
    }


    return res.status(201).json({
      status: "success",
      message: "User Created SuccessFully",
      data: userInfo,
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
    const passwordMatch = bcrypt.compare(password, user.password);
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
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );


    const hashedRefreshToken = await bcrypt.hash(refreshToken,10);

    const deviceId = crypto.randomUUID()

    const refreshObj = {
      token:hashedRefreshToken,
      deviceId,
      createdAt: new Date()
    }
    
    await User.updateOne(
      { _id: user._id },
      { $push: { refreshToken: refreshObj } }
    );

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

      
    res.cookie("deviceId", deviceId, {
      httpOnly: process.env.NODE_ENV !== "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

   
    const userInfo = {
      _id:user._id,
      profilePicture:user.profilePicture,
      firstName:user.firstName,
      lastName:user.lastName,
      email:user.email
    }

    return res
      .status(200)
      .json({ status: "success", message: "Login Successfull", data: userInfo});
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error", data: null });
  }
};

const logoutUser = async (req, res) => {
  try {
    const deviceId = req.cookies.deviceId
    const {userId} = req.body;
   
   await User.updateOne(
      { _id: userId },
      { $pull: { refreshToken: { deviceId } } }
    );
  
    res.clearCookie("accessToken", {
      httpOnly: process.env.NODE_ENV !== "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: process.env.NODE_ENV !== "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.clearCookie("deviceId", {
      httpOnly: process.env.NODE_ENV !== "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({
      status: "success",
      message: "User logged Out Successfully.",
      data: null,
    });
  } catch (e) {
   console.log(e.message)
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
    const deviceId = req.cookies.deviceId;

    if (!refreshToken || !deviceId) {
      return res.status(400).json({
        status: "error",
        message: "Refresh Token or Device Id Missing.",
        data: null,
      });
    }

    
    const user = await User.findOne({'refreshToken.deviceId':deviceId});

    if (!user){
      return res
      .status(403)
      .json({ status: "error", message: "User Not Found.", data: null });
    }
   
    const deviceRefreshToken = user.refreshToken.find(tok=>tok.deviceId===deviceId)

    if(!deviceRefreshToken){
      return res
      .status(401)
      .json({ status: "error", message: "Device Id not found", data: null });
    }
    const RTComp =  bcrypt.compare(refreshToken,deviceRefreshToken.token)


    if(!RTComp){
      return res
      .status(401)
      .json({ status: "error", message: "Invalid Refresh Token", data: null });
    }

  
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          await User.updateOne({ refreshToken }, { $pull:{refreshToken:{deviceRefreshToken}}});

             res.clearCookie("accessToken", {
      httpOnly: process.env.NODE_ENV !== "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: process.env.NODE_ENV !== "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.clearCookie("deviceId", {
      httpOnly: process.env.NODE_ENV !== "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

          if (err.name === "TokenExpiredError") {
            return res.status(401).json({
              status: "error",
              message: "Refresh token expired.",
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
          { expiresIn: "15m" }
        );

        res.cookie("accessToken", accessToken, {
          httpOnly: process.env.NODE_ENV !== "production",
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          maxAge: 15 * 60 * 1000, 
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
  const { AccessToken, RefreshToken, deviceId} = req.user;
 
  res.cookie("accessToken", AccessToken, {
    httpOnly: process.env.NODE_ENV !== "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 15 * 60 * 1000, 
  });

  res.cookie("refreshToken", RefreshToken, {
    httpOnly: process.env.NODE_ENV !== "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  
  res.cookie("deviceId", deviceId, {
    httpOnly: process.env.NODE_ENV !== "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });


  res.redirect("https://study-management-web-app.onrender.com/");
};

module.exports = { registerUser, loginUser, refresh, logoutUser, googleAuth };
