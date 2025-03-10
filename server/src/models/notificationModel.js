const mongoose = require("mongoose");
const notificationSchema = mongoose.Schema(
  {
    notification: {
      type: String,
      required: true,
    },
    notificationType: {
      type: String,
      enum: ["friendRequest", "notesShared"],
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);
const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
