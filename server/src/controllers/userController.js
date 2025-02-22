const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken')
const Notification = require("../models/notificationModel")


const getUserDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const userDetails = await User.findOne({ _id: userId }).select("profilePicture firstName lastName email");

        if (!userDetails) {
            return res.status(404).json({
                status:"error",
                message: "User not found",
                data: null,
            });
        }

        return res.status(200).json({
            status:"success",
            message: "User details fetched successfully",
            data: userDetails,
        });
    } catch (e) {
        console.error("Error fetching user details:", e);
        return res.status(500).json({
            status:"error",
            message: "Something went wrong. Please try again later.",
            data: null, 
        });
    }
};


const logoutUser = async(req,res)=>{
    try{
        const cookies = req.cookies;
        if(!cookies?.jwt) return res.sendStatus(204)
        const jwt = cookies.jwt;
        const user = await User.findOne({jwt})
        if(!user){
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204);
        }
        user.refreshToken = ""
        await user.save()
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }catch(e){
        return res.sendStatus(500).json({'message':e.message})
    }
   
}

const sendFriendRequest = async(req,res)=>{
    try{
      const {receiverId} = req.body;
      const senderId = req.userId
      const userInfos = await Promise.all([
        User.findOne({_id:senderId}).select('firstName sentFriendRequests friends'),
        User.findOne({_id:receiverId}).select('firstName lastName email profilePicture')
      ])

      const [senderInfo,receiverInfo] = userInfos

      if(!receiverInfo){
        return res.status(404).json({status:"error", message: "User not found", data:null });
      }
      

      if(senderInfo.sentFriendRequests.includes(receiverId)){
        return  res.status(400).json({status:"error", message:"Friend Request Already Sent", data:null})
      }
      
      if(senderInfo.friends.includes(receiverId)){
        return  res.status(400).json({status:"error",message:"Users are already Friends", data:null})
      }
     
      await Promise.all([
        User.updateOne({_id: senderId}, { $push: { sentFriendRequests: receiverId } }),
        User.updateOne({_id: receiverId}, { $push: { pendingFriendRequests: senderId } }),
      ])

      const newRequest = {
        _id:receiverId,
        proiflePicture: receiverInfo.profilePicture,
        firstName: receiverInfo.firstName,
        lastName: receiverInfo.lastName,
        email: receiverInfo.email
      }

      const notificationObj = {
        notification:`${senderInfo.firstName} sent you a friend Request`,
        notificationType:"friendRequest",
        receiverId:receiverId,
        read:false,
    }
     
       const notification =  await Notification.create(notificationObj)
       const userUpdate = await User.updateOne({_id:receiverId},{$push:{notifications:notification._id}})
       if(userUpdate.modifiedCount===0){
        await Notification.delete({_id:notification._id})
        return res.status(500).json({status:"error",message:"Unable to send Notification", data:null})
       }

      return res.status(200).json({status:"success",message:"Request Sent SuccessFully", data:newRequest})
    }catch(e){
      res.status(500).json({status:"error",message:e.message, data:null})
    }
   
    
}

const getPendingFriendRequests = async(req,res)=>{
    try{
     
        const userId = req.userId
        const user = await User.findOne({_id:userId}).populate("pendingFriendRequests")
        const friends = user.pendingFriendRequests;
        const resArray = friends.map((friend) => {
            return {
              id: friend._id,
              firstName: friend.firstName,
              lastName: friend.lastName,
              email: friend.email,
               profilePicture: friend.profilePicture,
            };
          });
        return res.status(200).json({message:"Pending Requests Fetched Successfully", data:resArray})

        }catch(e){
        return res.status(500).json({message:e.message})
        }
}

const getSentFriendRequests = async(req,res)=>{
    try{
       
        const userId = req.userId
        const user = await User.findOne({_id:userId}).populate("sentFriendRequests")
        console.log(user)
        const friends = user.sentFriendRequests;
        const resArray = friends.map((friend) => {
            return {
              id: friend._id,
              firstName: friend.firstName,
              lastName: friend.lastName,
              email: friend.email,
               profilePicture: friend.profilePicture,
            };
          });
        return res.status(200).json({message:"Sent Requests Fetched Successfully", data:resArray})

        }catch(e){
        return res.status(500).json({message:e.message})
        }
}

const getFriends = async(req,res)=>{
    try{
        
        const userId = req.userId

        const user = await User.findOne({_id:userId}).populate("friends")
        const friends = user.friends;
        const resArray = friends.map((friend) => {
            return {
              id: friend._id,
              firstName: friend.firstName,
              lastName: friend.lastName,
              email: friend.email,
               profilePicture: friend.profilePicture,
            };
          });

        return res.status(200).json({message:"Friend List Fetched Successfully", data: resArray})

        }catch(e){
        return res.status(500).json({message:e.message})
        }
}

const cancelRequestSent = async(req,res)=>{
    try{
        const {receiverId} = req.body
        const authHeader = req.headers.authorization || req.headers.Authorization
        if(!authHeader) return res.status(401).json({message:"Unauthorized"})
        const accessToken = authHeader.split(" ")[1]
        const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        const userId = decoded.userId
        const responseObj = await User.findOne({_id:userId}).select("sentFriendRequests")
        if(!responseObj.sentFriendRequests.includes(receiverId)){
            return res.status(400).json({message:"Cannot cancel the sent request"})
        }
        await Promise.all([
            User.updateOne({ _id: userId }, { $pull: { sentFriendRequests: receiverId } }),
            User.updateOne({ _id: receiverId }, { $pull: { pendingFriendRequests: userId } })
        ]);
       return res.status(200).json({message:"Request Cancelled Successfully"})

    }catch(e){
        return res.status(500).json({message:e.message})
    }
}

const respondFriendRequest = async(req,res)=>{
    try{
        const {senderId, response} = req.body
        const authHeader = req.headers.authorization || req.headers.Authorization
        if(!authHeader) return res.status(401).json({message:"Unauthorized"})
        const accessToken = authHeader.split(" ")[1]
        const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        const receiverId = decoded.userId
        const responseObj = await User.findOne({_id:receiverId}).select("pendingFriendRequests friends")
        const pendingFriendRequests = responseObj.pendingFriendRequests
        const friends = responseObj.friends
        if(friends.includes(senderId)){
            return res.status(400).json({message:"Users are already friends"})
        }
        if(!pendingFriendRequests.includes(senderId)){
            return res.status(400).json({message:"User hasn't sent friend request"})
        }
    
        if(response==="Accept"){
            await Promise.all([
                 User.updateOne({_id:receiverId},{
                    $pull:{pendingFriendRequests:senderId}
                }),
                 User.updateOne({_id:receiverId},{
                    $push:{friends:senderId}
                }),
                 User.updateOne({_id:senderId},{
                    $pull:{sentFriendRequests:receiverId}
                }),
                 User.updateOne({_id:senderId},{
                    $push:{friends:receiverId}
                }),
            ])
            return res.status(200).json({message:"Request Accepted Successfully"})
        }else if(response==="Reject"){
            Promise.all([
                 User.updateOne({_id:receiverId},{
                    $pull:{pendingFriendRequests:senderId}
                }),
                 User.updateOne({_id:senderId},{
                    $pull:{sentFriendRequests:receiverId}
                }),
            ])
            return res.status(200).json({message:"Request Rejected Successfully"})
        }else{
            return res.status(400).json({message:"Invalid Action"})
        }
    }catch(e){
        return res.status(500).json({message:e.message})
    }
}

const updateUserInfo = async(req,res)=>{
    try{
        const {changedFields} = req.body;
        if(Object.keys(changedFields).length===0){
            return res.status(401).json({status:"error",message:"Atleat one field is required to update!", data:null})
        }
        if(changedFields.email){
            return res.status(401).json({status:"error",message:"Email cannot be updated", data:null})
        }
        
        const authHeader = req.headers.authorization || req.headers.Authorization
        if(!authHeader) return res.status(401).json({message:"Unauthorized"})
        const accessToken = authHeader.split(" ")[1]
        const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        const userId = decoded.userId
        const update = await User.updateOne({_id:userId},{$set:changedFields})
     
        if(update.modifiedCount === 0){
            return res.status(404).json({status:"error",message:"User not found", data:null})
        }
        return res.status(200).json({status:"success",message:"UserInfo Updated Successfully", data:null})
    }catch(e){
        console.log(e.messaage)
        return res.status(500).json({status:"error", message:"Something went wrong!", data:null})
    }
  
}

module.exports = {logoutUser,sendFriendRequest,getPendingFriendRequests,getSentFriendRequests,getFriends,cancelRequestSent,respondFriendRequest, updateUserInfo, getUserDetails}