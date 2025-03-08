const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  const cookies = req.cookies;
  const accessToken = cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({status:"error", message: "Missing or invalid token", data:null }); 
  }

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(403).json({status:"success", message: "Invalid or expired token", data:null }); 
      }
      req.userId = decoded.userId; 
      next(); 
    }
  );
};

module.exports = verifyAccessToken;