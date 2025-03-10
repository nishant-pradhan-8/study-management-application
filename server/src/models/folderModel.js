const mongoose = require("mongoose");
const folderSchema = mongoose.Schema(
  {
    folderName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    accessedTimes: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);
const Folder = mongoose.model("Folder", folderSchema);
module.exports = Folder;
