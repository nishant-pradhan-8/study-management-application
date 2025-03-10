const Folder = require("../models/folderModel");
const Note = require("../models/noteModel");
const jwt = require("jsonwebtoken");
const { format } = require("date-fns");

const showFolders = async (req, res) => {
  try {
    const userId = req.userId;
    const folders = await Folder.find({ userId: userId }).select(
      "folderName createdAt"
    );
    return res.json({
      status: "success",
      message: "Folders Fetched Sucessfully",
      data: folders,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: "Server Error", data: null });
  }
};

const createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    const userId = req.userId;
    const newFolder = await Folder.create({ folderName, userId });
    return res.status(200).json({
      status: "success",
      message: "Folder Created Sucessfully",
      data: newFolder,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: e.message, data: null });
  }
};

const showFolderData = async (req, res) => {
  try {
    const { folderId } = req.params;
    const files = await Folder.findOne({ _id: folderId })
      .populate("notes")
      .select("folderName");

    if (files.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No notes found for this folder.",
        data: files,
      });
    }

    const fileData = files.notes.map((file) => ({
      noteName: file.noteName,
      _id: file._id,
      contentType: file.contentType,
      fileSize: file.fileSize,
      fileType: file.fileType,
      folderName: files.folderName,
      downloadUrl: file.downloadUrl,
    }));

    res.status(200).json({
      status: "success",
      message: "Files Fetched Sucessfully",
      data: fileData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "success",
      message: "Internal Server Error",
      data: null,
    });
  }
};
const deleteFolders = async (req, res) => {
  try {
    const { folderIds } = req.body;
    const userId = req.userId;

    const ops = await Promise.all([
      Folder.find({ _id: { $in: folderIds }, userId }),
      Folder.deleteMany({ _id: { $in: folderIds }, userId }),
    ]);

    if (ops[0].length === 0) {
      return res
        .status(204)
        .json({ status: "success", message: "Folders not found", data: null });
    }

    const noteIds = ops[0].flatMap((folder) => folder.notes);

    if (noteIds && noteIds.length > 0) {
      await Note.deleteMany({ _id: { $in: noteIds } });
    }

    return res.status(200).json({
      status: "success",
      message: "Folder Deleted Successfully",
      data: null,
    });
  } catch (e) {
    console.error("Error deleting folder:", e);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error", data: null });
  }
};

const countFolderAccess = async (req, res) => {
  try {
    const { folderId } = req.body;
    const userId = req.userId;
    const frequentlyAccessedFolders = await Folder.updateOne(
      { _id: folderId, userId },
      { $inc: { accessedTimes: 1 } }
    );

    if (frequentlyAccessedFolders.modifiedCount === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Folder Not Found", data: null });
    }
    return res.status(200).json({
      status: "success",
      message: "Accessed Count Updated Successfully",
      data: null,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Errors", data: null });
  }
};

const getQuickAccessFolders = async (req, res) => {
  try {
    const userId = req.userId;
    const quickAccessFolders = await Folder.find({
      userId,
      accessedTimes: { $gte: 0 },
    })
      .sort({ accessedTimes: -1 })
      .limit(5)
      .select("folderName createdAt");

    return res.status(200).json({
      status: "success",
      message: "Quick Accessed Folders Fetched Sucessfully",
      data: quickAccessFolders,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error", data: null });
  }
};

const folderInfo = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.userId;

    const folderInfo = await Folder.findOne({ _id: folderId, userId }).select(
      "folderName createdAt updatedAt notes"
    );

    if (!folderInfo) {
      return res
        .status(404)
        .json({ status: "error", message: "Folder not found.", data: null });
    }

    const resObj = {
      folderName: folderInfo.folderName,
      createdAt: format(folderInfo.createdAt, "yyyy-MM-dd"),
      lastUpdated: format(folderInfo.updatedAt, "yyyy-MM-dd"),
      totalNotes: folderInfo.notes.length,
    };

    return res.status(200).json({
      status: "success",
      message: "Folder Info Fetched Successfully.",
      data: resObj,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error.", data: null });
  }
};

const renameFolder = async (req, res) => {
  try {
    const { newFolderName, folderId } = req.body;
    const userId = req.userId;
    const folderUpdate = await Folder.updateOne(
      { _id: folderId, userId },
      { folderName: newFolderName }
    );

    if (folderUpdate.modifiedCount === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Folder not found.", data: null });
    }
    return res.status(200).json({
      status: "success",
      message: "Folder Updated Sucessfully",
      data: null,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error", data: null });
  }
};

module.exports = {
  createFolder,
  showFolders,
  showFolderData,
  countFolderAccess,
  getQuickAccessFolders,
  deleteFolders,
  folderInfo,
  renameFolder,
};
