const mongoose = require("mongoose");
const sharedFilesSchema = mongoose.Schema(
  {
    noteName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    downloadUrl: {
      type: String,
      required: true,
    },
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const SharedFile = mongoose.model("sharedFile", sharedFilesSchema);
module.exports = SharedFile;
