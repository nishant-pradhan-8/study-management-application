const jwt = require('jsonwebtoken')
const User = require("../models/userModel")
const refreshAccessToken = (req,res)=>{
    const cookies = req.cookies;
    console.log(cookies)
    if(!cookies?.jwt)return res.sendStatus(401)
    const refreshToken = cookies.jwt;
console.log(refreshToken)
    const user = User.findOne({refreshToken})
    if(!user) return  res.sendStatus(403)
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
           if(err || decoded.email!==user.email)return res.sendStatus(403)
           const accessToken = jwt.sign(
              {email: decoded.email},
              process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            )
            res.json({accessToken})
        }
    )

}
module.exports = refreshAccessToken