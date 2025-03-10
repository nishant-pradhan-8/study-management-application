const Note = require("../models/noteModel");

const Folder = require("../models/folderModel");
const { format } = require("date-fns");

const uploadNotes = async (req, res) => {
  try {
    const { newNotes, folderId } = req.body;
    const uploads = await Note.insertMany(newNotes);
    const newNoteIds = await uploads.map((note) => note._id);
    await Folder.updateOne(
      { _id: folderId },
      { $push: { notes: { $each: newNoteIds } } }
    );
    const responseObj = uploads.map((note)=>{
       return {
          noteName: note.noteName,
          _id: note.note_id,
          contentType:  note.contentType,
          fileSize: note.fileSize,
          fileType:  note.fileType,
          folderId:  note.folderId,
          downloadUrl:  note.downloadUrl
       }
    })
    return res
      .status(200)
      .json({
        status: "succes",
        message: "Notes Uploaded Sucessfully",
        data: responseObj,
      });
  } catch (e) {
    console.log(e.message);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error", data: null });
  }
};
const deleteNotes = async (req, res) => {
  try {
    const { notesToDelete } = req.body;
    const userId = req.userId;

    if (!Array.isArray(notesToDelete) || notesToDelete.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid Notes Array", data: null });
    }

    const noteIds = notesToDelete.map((note) => note._id);
    const folderIds = notesToDelete.map((note) => note.folderId);

    if (noteIds.length === 0) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "No valid note IDs provided",
          data: null,
        });
    }

    const noteDelete = await Note.deleteMany({ _id: { $in: noteIds }, userId });

    if (noteDelete.deletedCount === 0) {
      return res
        .status(204)
        .json({
          status: "error",
          message: "No matching notes found!",
          data: null,
        });
    }

    await Folder.updateMany(
      { _id: { $in: folderIds } },
      { $pull: { notes: { $in: noteIds } } }
    );

    return res
      .status(200)
      .json({
        status: "success",
        message: "Notes deleted successfully",
        data: null,
      });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error", data: null });
  }
};

const replaceNotes = async (req, res) => {
  try {
    const { replacingNotes } = req.body;

    const bulkUpdate = replacingNotes.map((note) => ({
      updateOne: {
        filter: { noteName: note.noteName },
        update: note,
        upsert: true,
      },
    }));

    await Note.bulkWrite(bulkUpdate);
    const updatedDocs = await Note.find({
      noteName: { $in: replacingNotes.map((note) => note.noteName) },
    });

    const responseObj = updatedDocs.map((note)=>{
      return {
         noteName: note.noteName,
         _id: note.note_id,
         contentType:  note.contentType,
         fileSize: note.fileSize,
         fileType:  note.fileType,
         folderId:  note.folderId,
         downloadUrl:  note.downloadUrl
      }
   })
    return res
      .status(200)
      .json({
        status: "succes",
        message: "Notes Updated SucessFully",
        data: responseObj,
      });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: e.message, data: null });
  }
};
const updateLastViewed = async (req, res) => {
  try {
    const { noteId } = req.body;
    if (!noteId) {
      return res
        .status(400)
        .json({ status: "error", message: "NoteId is required", data: null });
    }
    const noteUpdate = await Note.updateOne(
      { _id: noteId },
      { lastViewed: new Date() }
    );
    if (noteUpdate.modifiedCount === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "No notes To update", data: null });
    }
    return res
      .status(200)
      .json({
        status: "success",
        message: "Last Viewed Updated Sucessfully",
        data: null,
      });
  } catch (e) {
    return res
      .status(500)
      .json({
        status: "error",
        message: "Unexpected Error Occurred",
        errors: { message: e.messages },
      });
  }
};

const getLastViewedNotes = async (req, res) => {
  try {
    const userId = req.userId;
    const lastViewedNotes = await Note.find({
      userId: userId,
      lastViewed: { $exists: true, $ne: null },
    })
      .sort({ lastViewed: -1 })
      .limit(5)
      .populate("folderId")
      .select("noteName noteId contentType fileSize fileType downloadUrl");
    if (lastViewedNotes.length === 0) {
      return res
        .status(204)
        .json({ status: "success", message: "No last viewed notes", data: [] });
    }
    const resObj = lastViewedNotes.map((note) => ({
      noteName: note.noteName,
      _id: note._id,
      contentType: note.contentType,
      fileSize: note.fileSize,
      fileType: note.fileType,
      folderName: note.folderId.folderName,
      downloadUrl: note.downloadUrl,
    }));
    return res
      .status(200)
      .json({
        status: "success",
        message: "Last Viewed Notes Fetched Sucessfully",
        data: resObj,
      });
  } catch (e) {
    return res
      .status(500)
      .json({
        status: "error",
        message: "Unexpected Error Occurred",
        errors: { message: e.message },
        data: null,
      });
  }
};

const noteInfo = async (req, res) => {
  try {
    const { noteId } = req.params;

    const userId = req.userId;

    const noteInfo = await Note.findOne({ _id: noteId, userId })
      .select("noteName fileSize fileType lastViewed createdAt")
      .populate("folderId");

    if (!noteInfo) {
      return res
        .status(404)
        .json({ status: "error", message: "Note not found.", data: null });
    }

    const resObj = {
      noteName: noteInfo.noteName,
      fileSize: noteInfo.fileSize,
      fileType: noteInfo.fileType,
      folderName: noteInfo.folderId.folderName,
      uploadedAt: format(noteInfo.createdAt, "yyyy-MM-dd"),
      lastViewed: format(noteInfo.lastViewed, "yyyy-MM-dd"),
    };

    return res
      .status(200)
      .json({
        status: "success",
        message: "Note Info Fetched Successfully.",
        data: resObj,
      });
  } catch (e) {
    console.log(e.message);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error.", data: null });
  }
};

module.exports = {
  uploadNotes,
  deleteNotes,
  replaceNotes,
  updateLastViewed,
  getLastViewedNotes,
  noteInfo,
};
