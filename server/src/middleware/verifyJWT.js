const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization; 

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Missing or invalid token" }); 
  }

  const accessToken = authHeader.split(' ')[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(403).json({ message: "Invalid or expired token" }); 
      }
      req.userId = decoded.userId; 
    
      next(); 
    }
  );
};

module.exports = verifyJWT;