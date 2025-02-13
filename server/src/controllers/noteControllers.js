const Note = require('../models/noteModel')
const User = require("../models/userModel")
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const SharedFile = require('../models/sharedFilesModel');

/*

const uploadNote = async (req, res) => {
  try {
    const files = req.files;
    const {folderId} = req.body
  
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    console.log(files)
/*
    for(const file of files){
      const storageRef = ref(storage, `Students/${user}/${folderId}/${file.name}`)
      const metadata = {
        contentType: file.type,
        customMetadata: {
          fileName: file.name,
          noteId: 
        },
    };
    }
    
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "notes" });
    await Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = bucket.openUploadStream(file.originalname, {
            contentType: file.mimetype,
            metadata: { folderId },
          });
          stream.on("finish", resolve); 
          stream.on("error", reject);
          stream.end(file.buffer);
        });
      })
    );
    const latestFiles = await mongoose.connection.db.collection("notes.files").find({ "metadata.folderId": folderId }).toArray();
    const fileData = latestFiles.map(file => ({
      fileName: file.filename,
      fileId: file._id,
      contentType: file.contentType,
    }));
    res.status(200).json({ message: "Files uploaded successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ "message": error.message });
  }
};
*/
const uploadNotes = async(req,res)=>{
  try{
    const {newNotes} = req.body
    const uploads = await Note.insertMany(newNotes)
    return res.status(200).json({status:"succes",message:"Notes Uploaded Sucessfully",data:uploads})
  }catch(e){
    return res.status(500).json({message:e.message})
  }
 
}


const deleteNote = async(req, res)=>{
  try{
    const {noteId} = req.params
    console.log(noteId)
    await Note.deleteOne({_id:noteId})
  
    return res.status(200).json({message:"Note Deleted Sucessfully"})
  }catch(e){
    return res.status(500).json({message:e.message})
  }
}

const replaceNotes = async(req,res)=>{
  try{
    const {replacingNotes} = req.body
  
    const bulkUpdate = replacingNotes.map((note)=>({
      updateOne:{
        filter: { noteName: note.noteName}, 
        update: note, 
        upsert: true 
      }
    }))

    await Note.bulkWrite(bulkUpdate)
    const updatedDocs = await Note.find({
      noteName:{$in:replacingNotes.map(note=>note.noteName)}
    })
    
    return res.status(200).json({message:"Notes Updated SucessFully", data:updatedDocs})
  }catch(e){
    return res.status(500).json({message:e.message})
  }
}
const updateLastViewed = async(req,res)=>{
  try{
    const {noteId} = req.body;
    console.log(noteId)
    if(!noteId){
      return res.status(400).json({status:"error",message:"NoteId is required", data:null})
    }
    const noteUpdate = await Note.updateOne({_id:noteId},{lastViewed:new Date()})
    console.log(noteUpdate)
    if(noteUpdate.modifiedCount === 0){
      return res.status(404).json({status:"error",message:"No notes To update", data:null})
    }
    console.log(noteUpdate)
    return res.status(200).json({status:"success",message:"Last Viewed Updated Sucessfully", data:null})

  }catch(e){
    return res.status(500).json({status:"error",message:"Unexpected Error Occurred", errors:{message:e.messages}})
  }
  

}

const getLastViewedNotes = async(req,res)=>{
  try{
    const userId = req.userId
    const lastViewedNotes = await Note.find({ 
      userId: userId, 
      lastViewed: { $exists: true, $ne: null } 
    }).sort({ lastViewed: -1 }).limit(5);
    return res.status(200).json({status:"success",message:"Last Viewed Notes Fetched Sucessfully", data:lastViewed})
  }catch(e){
    return res.status(500).json({status:"error",message:"Unexpected Error Occurred", errors:{message:e.message}})
  }
 
}
/*
const shareNote = async(req,res)=>{
  try{
    const {shareList, noteId} = req.body
    console.log(noteId)
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader) return res.status(401).json({message:"Unauthorized"})
    const accessToken = authHeader.split(" ")[1]
    const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    const sharerId = decoded.userId
    if (!Array.isArray(shareList) || shareList.length === 0) {
      return res.status(400).json({ message: "Share list must be a non-empty array of user IDs." });
    }
    if (!noteId) {
      return res.status(400).json({ message: "Note Id is required!" });
    }        
    const sharedWithObj = await Note.findOne({ _id: noteId }).select("sharedWith");

    if (!sharedWithObj) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    const sharedWithSet = new Set(sharedWithObj.sharedWith.map(id => id.toString())); 
    
    const repeatedSharedUsers = shareList.filter(user => sharedWithSet.has(user));
    
    if (repeatedSharedUsers.length > 0) {
      return res.status(400).json({ message: "Cannot share file twice with the same user" });
    }
    await Promise.all([
      Note.updateOne({_id:noteId},{$push:{sharedWith:{$each:shareList}}}),
      User.updateMany({_id:{$in:shareList}},{$push:{sharedFiles:{noteId:noteId,sharedBy:sharerId}}})
    ])

    return res.status(200).json({message:"Notes shared sucessfully"})
  }catch(e){
    return res.status(500).json({message:e.message})
  }

}
  */



/*
const getSharedNotes = async(req,res)=>{
  try{
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader) return res.status(401).json({message:"Unauthorized"})
    const accessToken = authHeader.split(" ")[1]
    const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    const userId = decoded.userId
    const sharedFileObj = await User.findOne({_id:userId}).select("sharedFiles")

    if (!sharedFileObj) return res.status(404).json({ message: "User not found" })

    const noteIds = sharedFileObj.sharedFiles.map(file=>file.noteId)

    if(noteIds.length===0) return res.status(200).json({ message: "No shared notes", data: [] });

    const sharedFiles = await Note.find({_id:{$in:noteIds}}).select("noteName contentType downloadUrl")
  
    const responseObj = sharedFiles.map((noteObj)=>{
      const match = sharedFileObj.sharedFiles.find((file)=>file.noteId===noteObj.noteId)
      return(
        {...noteObj,
          sharedBy: match? match.sharedBY : null }
      )
    })
     
    return res.status(200).json({message:"Shared Notes Fetched Sucessfully", data:responseObj})
  }catch(e){
    return res.status(500).json({message:e.message})
  }
 
}*/

module.exports = {uploadNotes, deleteNote, replaceNotes,updateLastViewed,getLastViewedNotes}