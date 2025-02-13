const mongoose = require('mongoose')
const folderSchema = mongoose.Schema({
    folderName:{
        type:String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    lastViewed:{
        type:Date,
        default: Date.now
    },
},
    
    { timestamps: true } 
)
const Folder = mongoose.model('Folder',folderSchema)
module.exports = Folder