const Folder = require("../models/folderModel")
const Note = require("../models/noteModel")
const jwt = require("jsonwebtoken")
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose")


const showFolders = async(req,res)=>{
    try{
        const userId = req.userId
        const folders = await Folder.find({userId:userId}).select("folderName createdAt")
        return res.json({status:"success",message:"Folders Fetched Sucessfully", data:folders})
    }catch(e){
        return res.status(500).json({status:"error",message:"Server Error", data:null})
    }
}

const createFolder = async(req,res)=>{
    try{
        const {folderName} = req.body
        const userId = req.userId
        const newFolder = await Folder.create({folderName,userId})
        return  res.status(200).json({status:"success", 'message':"Folder Created Sucessfully","data":newFolder})
        
    }catch(e){
        return res.status(500).json({status:"error",'message':e.message, data:null})
    }
}

const showFolderData = async(req,res)=>{
  try {
    const { folderId } = req.params;
    
    const files = await Note.find({folderId});
   
    if (files.length === 0) {
      return res.status(200).json({status:"success", message: "No notes found for this folder.", data:files });
    }

    const fileData = files.map(file => ({
      noteName: file.noteName,
      noteId: file._id,
      contentType: file.contentType,
      downloadUrl: file.downloadUrl
    }));
    console.log(fileData,'fd')
  
    res.status(200).json({status:"success", message:"Files Fetched Sucessfully", data: fileData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status:"success",  message: "Internal Server Error", data:null });
  }
   
}
const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.body;
    const userId = req.userId;

    const deletedFolder = await Folder.findOneAndDelete({ _id: folderId, userId }); 

    if (deletedFolder.deletedCount === 0) {
      return res.status(404).json({ status: 'error', message: 'Folder not Found', data: null });
    }

    const noteIds = deletedFolder.notes;

    if (noteIds && noteIds.length > 0) {
       await Note.deleteMany({ _id: { $in: noteIds } });
    }

    return res.status(204).json({ status: 'success', message: 'Folder Deleted Successfully', data: null });

  } catch (e) {
    console.error("Error deleting folder:", e); 
    return res.status(500).json({ status: 'error', message: 'Internal Server Error', data: null });
  }
};


const countFolderAccess = async(req,res)=>{
  try{
    const {folderId} = req.body;
    const userId = req.userId
    const frequentlyAccessedFolders = await Folder.updateOne({_id:folderId,userId},{$inc:{accessedTimes:1}})
    if(frequentlyAccessedFolders.modifiedCount === 0){
      return res.status(404).json({status:"error", 'message':"Folder Not Found","data":null})
    } 
    return  res.status(200).json({status:"success", 'message':"Accessed Count Updated Successfully","data":null})
  
  }catch(e){
    return  res.status(500).json({status:"error", 'message':"Internal Server Errors","data":null})
  
  }

}

const getQuickAccessFolders = async(req,res)=>{
  try{
    const userId = req.userId
    const quickAccessFolders = await Folder.find({userId,accessedTimes:{$gte:1}}).sort({accessedTimes:-1}).limit(5).select("folderName createdAt")
    return  res.status(200).json({status:"success", 'message':"Quick Accessed Folders Fetched Sucessfully","data":quickAccessFolders})
  }catch(e){
    return  res.status(500).json({status:"error", 'message':e.message,"data":null})
  }
 
}


module.exports = {createFolder, showFolders, showFolderData,countFolderAccess, getQuickAccessFolders, deleteFolder }