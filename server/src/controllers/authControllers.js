const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const registerUser = async(req,res)=>{
    
    try{
        const {userName, firstName, lastName, email, password} = req.body
        const user = await User.findOne({email})
        if(user){
            return res.status(409).json({'message':'User Already Exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({userName, firstName, lastName, email, password:hashedPassword, refreshToken:""})
        const userId = newUser._id
        const accessToken = jwt.sign(
            {
               userId:newUser._id,
               email
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            {   userId:newUser._id,
                email},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
       await User.updateOne({_id:userId},{refreshToken})
        res.cookie('jwt',refreshToken,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(201).json({'accessToken':accessToken,'message':"User Created SuccessFully"})
    }catch(e){
        return res.status(500).json({'message':e.message})
    }
}

const loginUser = async(req,res)=>{
    try{
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({'message':"Email is not registered. Please Create an Account"})
        }
        const passwordMatch = await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            return res.status(401).json({'message':"Incorrect Password"})
        }
        const accessToken = jwt.sign(
            {
                userId:user._id,
                email
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '7d' }
        );
        const refreshToken = jwt.sign(
            {  
                userId:user._id,
                email
             },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '30d' }
        );
        user.updateOne({email},{refreshToken})
        res.cookie('jwt',refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        })
       
        return res.status(200).json({'accessToken':accessToken,"message":"Login SuccessFull"})
    }catch(e){
        return res.status(500).json({'message':e.message})
    }
 
}
module.exports = {registerUser, loginUser}