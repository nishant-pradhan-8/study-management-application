const SharedFile = require("../models/sharedFilesModel")
const jwt = require('jsonwebtoken')
const User = require("../models/userModel")
const Notification = require("../models/notificationModel")
const getSharedNotes = async(req,res)=>{
    try{
      const authHeader = req.headers.authorization || req.headers.Authorization
      if(!authHeader) return res.status(401).json({message:"Unauthorized"})
      const accessToken = authHeader.split(" ")[1]
      const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
      const receiverId = decoded.userId
      const receivedNotes = await SharedFile.find({receivedBy:receiverId}).select(" noteName contentType downloadUrl sharedBy receivedBy")
      return res.status(200).json({message:"Notes Shared Sucessfully",data:receivedNotes})
    } catch(e){
      return res.status(500).json({message:e.message})
    }
  }
  const shareNote = async (req, res) => {
    try {
      const { notes } = req.body;
  
      if (notes.length === 0) {
        return res.status(400).json({ message: "No Notes to Share" });
      }
  
      const uploads = await SharedFile.insertMany(notes);
  
  
      const notificationOps = [];
      const userUpdateOps = [];
  
      for (const note of notes) {
        if (note.receivedBy) {
          const notificationObj = {
            notification: `${note.sharedBy} sent you study Notes ♥️`,
            notificationType: "notesShared",
            receiverId: note.receivedBy,
            read: false,
          };
  
          const notification = new Notification(notificationObj); 
  
          notificationOps.push({ insertOne: { document: notification } }); 
  
          userUpdateOps.push({
            updateOne: {
              filter: { _id: note.receivedBy },
              update: { $push: { notifications: notification } }, 
            },
          });
        } else {
          console.log(`Invalid userId for note: ${note._id}`);
        }
      }
  
      await Notification.bulkWrite(notificationOps);
      const userUpdates = await User.bulkWrite(userUpdateOps);
  
      if (userUpdates.modifiedCount !== notes.filter(note => note.receivedBy).length) { 
       
          if(notFoundUsers.length > 0){
              console.error("Some users were not found during notification update:");
          }
  
          if(userUpdates.result.writeErrors){
              console.error("Errors during user update:", userUpdates.result.writeErrors);
          }
      }
  
  
      return res.status(200).json({
        status: "success",
        message: "Notes Shared Sucessfully",
        data: uploads,
      });
    } catch (e) {
      return res.status(500).json({ status: "error", message: e.message, data: null });
    }
  };
module.exports = {shareNote, getSharedNotes}