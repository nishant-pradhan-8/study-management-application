const Folder = require("../models/folderModel")
const Note = require("../models/noteModel")
const jwt = require("jsonwebtoken")
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose")
const showFolders = async(req,res)=>{
    try{
        const authHeader =  req.headers.authorization || req.headers.Authroization
        const accessToken = authHeader.split(" ")[1]
        const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        const folders = await Folder.find({userId:decoded.userId})
        return res.json({status:"success",message:"Folders Fetched Sucessfully", data:folders})
    }catch(e){
        return res.status(500).json({status:"success",message:"Server Error", data:null})
    }
}

const createFolder = async(req,res)=>{
    try{
        const authHeader = req.headers.authorization || req.headers.Authroization
        if(!authHeader) return res.status(401).json({message:"Unauthorized"})
        const {folderName} = req.body
        const accessToken = authHeader.split(" ")[1]
        const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        const userId = decoded.userId
        const newFolder = await Folder.create({folderName,userId})
        return  res.status(200).json({'message':"Folder Created Sucessfully","data":newFolder})
        
    }catch(e){
        return res.status(500).json({'message':e.message})
    }
}

const showFolderData = async(req,res)=>{
  try {
    const { folderId } = req.params;
    
    const files = await Note.find({folderId});
   
    if (files.length === 0) {
      return res.status(200).json({status:"success", message: "No notes found for this folder.", data:null });
    }

    const fileData = files.map(file => ({
      noteName: file.noteName,
      noteId: file._id,
      contentType: file.contentType,
      downloadUrl: file.downloadUrl
    }));
  
    res.status(200).json({message:"Files Fetched Sucessfully", notes: fileData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
   
}
module.exports = {createFolder, showFolders, showFolderData}