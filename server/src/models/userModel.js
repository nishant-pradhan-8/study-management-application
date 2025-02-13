const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    profilePicture:{
        type:String,
    },

    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }, 
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    sentFriendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    pendingFriendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    events:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Event"
    }],
    notifications:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Notification"
    }],
  
    refreshToken:{
        type:String,
        required:true
    }
    },
    { timestamps: true } 
)
const User = mongoose.model('User',userSchema)
module.exports = User