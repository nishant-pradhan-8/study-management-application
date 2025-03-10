const Notification = require("../models/notificationModel");

const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const notifications = await Notification.find({
      receiverId: userId,
    })
      .select("notification notificationType read createdAt")
      .sort({ createdAt: -1 });

    if (notifications.length === 0) {
      return res.status(204).json({
        status: "success",
        message: "No notifications found",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Notifications Fetched Successfully",
      data: notifications,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: e.message, data: null });
  }
};
const markNotificationRead = async (req, res) => {
  try {
    const { read } = req.body;
    const userId = req.userId;
    await Notification.updateMany(
      { receiverId: userId, read: false },
      { read }
    );

    return res.status(200).json({
      status: "success",
      message: "All Notification Marked as Read",
      data: null,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: e.message, data: null });
  }
};
module.exports = { getNotifications, markNotificationRead };
