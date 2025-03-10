const SharedFile = require("../models/sharedFilesModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Note = require("../models/noteModel");
const Folder = require("../models/folderModel");

const getSharedNotes = async (req, res) => {
  try {
    const userId = req.userId;
    const receivedNotes = await SharedFile.find({ receivedBy: userId })
      .select("noteName fileType fileSize contentType downloadUrl sharedBy")
      .populate("sharedBy", "firstName");

    const resObj = receivedNotes.map((note) => ({
      _id: note._id,
      noteName: note.noteName,
      fileSize: note.fileSize,
      fileType: note.fileType,
      contentType: note.contentType,
      downloadUrl: note.downloadUrl,
      sharedBy: note.sharedBy ? note.sharedBy.firstName : null,
    }));

    return res
      .status(200)
      .json({ message: "Notes Shared Sucessfully", data: resObj });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
const shareNote = async (req, res) => {
  try {
    const { notes } = req.body;
    const userId = req.userId;

    if (notes.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "No Notes to Share", data: null });
    }

    const senderInfo = await User.findOne({ _id: userId }).select("firstName");

    const modifiedNotes = notes.map(({ _id, ...rest }) => rest);

    await SharedFile.insertMany(modifiedNotes);

    const notificationOps = [];
    const userUpdateOps = [];
    const notesSharedOps = [];
    const receivedList = [];
    for (const note of notes) {
      if (note.receivedBy) {
        receivedList.push(note.receivedBy);

        if (!receivedNotes.includes(note.receivedBy)) {
          const notificationObj = {
            notification: `${senderInfo.firstName} sent you study Notes ♥️`,
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
        }

        notesSharedOps.push({
          updateOne: {
            filter: { _id: note._id },
            update: { $push: { sharedWith: note.receivedBy } },
          },
        });
      } else {
        console.log(`Invalid userId for note: ${note._id}`);
      }
    }

    const dbAction = await Promise.all([
      Notification.bulkWrite(notificationOps),
      User.bulkWrite(userUpdateOps),
      Note.bulkWrite(notesSharedOps),
    ]);

    const userUpdateResult = dbAction[1];

    if (
      userUpdateResult.modifiedCount !==
      notes.filter((note) => note.receivedBy).length
    ) {
      if (notFoundUsers.length > 0) {
        console.error("Some users were not found during notification update.");
      }

      if (
        userUpdateResult.writeErrors &&
        userUpdateResult.writeErrors.length > 0
      ) {
        console.error(
          "Errors during user update:",
          userUpdateResult.writeErrors
        );
      }
    }

    return res.status(204).json({
      status: "success",
      message: "Notes Shared Sucessfully",
      data: null,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: e.message, data: null });
  }
};

const transferNote = async (req, res) => {
  try {
    const { notesToTransfer } = req.body;

    if (!notesToTransfer || notesToTransfer.length === 0) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Invalid array of Notes",
          data: null,
        });
    }
    const userId = req.userId;

    const modifiedNotes = notesToTransfer.map(({ _id, ...rest }) => rest);

    const noteIds = notesToTransfer.map((_id) => _id);

    const sharedNotesDeleteOp = await SharedFile.deleteOne({
      _id: { $in: noteIds },
      receivedBy: userId,
    });

    if (sharedNotesDeleteOp.deletedCount === 0) {
      return res
        .status(204)
        .json({
          status: "success",
          message: "Shared Note not found for the user",
          data: null,
        });
    }

    const noteInsertion = await Note.create(modifiedNotes);

    const insertedIds = noteInsertion.map((note) => note._id);

    await Folder.updateOne(
      { _id: noteInsertion[0].folderId, userId },
      { $push: { notes: { $each: insertedIds } } }
    );

    return res.status(200).json({
      status: "success",
      message: "Note Transferred Succesfully",
      data: null,
    });
  } catch (e) {
    return res
      .status(500)
      .json({
        status: "error",
        message: `Failed To Transfer Note: ${e.message}`,
        data: null,
      });
  }
};

const deleteSharedNotes = async (req, res) => {
  try {
    const { sharedNotesToDelete } = req.body;
    if (!sharedNotesToDelete || sharedNotesToDelete.length === 0) {
      res
        .status(400)
        .json({
          status: "error",
          message: "Invalid Shared Note Ids Array",
          data: null,
        });
    }
    const userId = req.userId;
    const sharedNotesIds = sharedNotesToDelete.map((note) => note._id);
    const deleteOps = await SharedFile.deleteMany({
      _id: { $in: sharedNotesIds },
      receivedBy: userId,
    });

    if (deleteOps.deletedCount === 0) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Shared Notes not found",
          data: null,
        });
    }

    if (deleteOps.deletedCount !== sharedNotesIds.length) {
      return res
        .status(200)
        .json({
          status: "success",
          message: `${deleteOps.deletedCount} Notes were deleted, some were not found`,
          data: null,
        });
    }

    return res
      .status(200)
      .json({
        status: "success",
        message: `Shared Notes Deleted Successfully`,
        data: null,
      });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: `Internal Server Error`, data: null });
  }
};
module.exports = { shareNote, getSharedNotes, transferNote, deleteSharedNotes };
