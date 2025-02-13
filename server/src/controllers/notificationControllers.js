const jwt = require("jsonwebtoken")
const Notification = require("../models/notificationModel")

const getNotifications = async(req,res)=>{
    try{
         const authHeader = req.headers.authorization || req.headers.Authorization
         if(!authHeader) return res.status(401).json({message:"Unauthorized"})
         const accessToken = authHeader.split(" ")[1]
         const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
         const userId = decoded.userId
         const notifications = await Notification.find({receiverId:userId}).select("notification notificationType read createdAt")
         if(notifications.length===0) return res.status(404).json({status:"success", message:"No notifications found", data:null})
         return res.status(200).json({status:"success", message:"Notifications Fetched Successfully",data:notifications} )
    }catch(e){
        return res.status(500).json({status:"error", message:e.message, data:null})
    }
}
const markNotificationRead = async(req,res)=>{
    try{
        const authHeader = req.headers.authorization || req.headers.Authorization
        if(!authHeader) return res.status(401).json({message:"Unauthorized"})
        const accessToken = authHeader.split(" ")[1]
        const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        const userId = decoded.userId
        await Notification.updateMany({receiverId:userId,read:false},{read:true})
        return res.status(200).json({status:"success", message:"All Notification Marked as Read", data:null})
    }catch(e){
        return res.status(500).json({status:"error", message:e.message, data:null})
    }
   
}
module.exports = {getNotifications, markNotificationRead}