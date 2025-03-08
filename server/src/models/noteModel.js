const mongoose = require('mongoose')
const noteSchema = mongoose.Schema({
    noteName:{
        type:String,
        required: true
    },
    profilePicture:{
        type:String,
    },
    contentType:{
        type:String,
        required:true,
    },
    fileSize:{
        type:String,
        required:true,
    },
    fileType:{
        type:String,
        required:true,
    },
    folderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder', 
        required: true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    sharedWith:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    }],
    
    downloadUrl:{
        type: String,
 
        required: true
    },
  
    lastViewed:{
        type:Date,
        default:null
    },
},
    
    { timestamps: true } 
)
const Note = mongoose.model('Note',noteSchema)
module.exports = Note