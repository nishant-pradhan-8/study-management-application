const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Notification = require("../models/notificationModel");

const getUserDetails = async (req, res) => {
  try {

    const userId = req.userId;
    const userDetails = await User.findOne({ _id: userId }).select(
      "profilePicture firstName lastName email"
    );

    if (!userDetails) {
      return res.status(204).json({
        status: "error",
        message: "User not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User details fetched successfully",
      data: userDetails,
    });

  } catch (e) {

    return res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later.",
      data: null,
    });
  }
};


const sendFriendRequest = async (req, res) => {
  try {
    const { receiverEmail } = req.body;
    const senderId = req.userId;
    const userInfos = await Promise.all([
      User.findOne({ _id: senderId }).select(
        "firstName email  sentFriendRequests friends"
      ).populate("sentFriendRequests friends"),
      User.findOne({ email: receiverEmail }).select(
        "firstName lastName  email profilePicture"
      ),
    ]);

    const [senderInfo, receiverInfo] = userInfos;
   if(senderInfo.email === receiverEmail){
    return res
    .status(404)
    .json({ status: "error", message: "Cannot Send Request.", data: null });
   }
    if (!receiverInfo) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found", data: null });
    }
    const senderSentFriendRequestEmail = senderInfo.sentFriendRequests.map(friends=>friends.email) || []
    const senderFriendsEmail =  senderInfo.friends.map(friends=>friends.email) || []
    if (senderSentFriendRequestEmail.includes(receiverEmail)) {
      return res.status(400).json({
        status: "error",
        message: "Friend Request Already Sent",
        data: null,
      });
    }

    if (senderFriendsEmail.includes(receiverEmail)) {
      return res.status(400).json({
        status: "error",
        message: "Users are already Friends",
        data: null,
      });
    }await Promise.all([
      User.updateOne(
        { _id: senderId },
        { $push: { sentFriendRequests: receiverInfo._id } }
      ),
      User.updateOne(
        { _id: receiverInfo._id }, // ✅ Correct field (_id)
        { $push: { pendingFriendRequests: senderId } }
      ),
    ]);
    
    
    const newRequest = {
      _id: receiverInfo._id,
      profilePicture: receiverInfo.profilePicture, 
      firstName: receiverInfo.firstName,
      lastName: receiverInfo.lastName,
      email: receiverInfo.email,
    };
    
    const notificationObj = {
      notification: `${senderInfo.firstName} sent you a friend Request`,
      notificationType: "friendRequest",
      receiverId: receiverInfo._id,
      read: false,
    };

    const notification = await Notification.create(notificationObj);
    const userUpdate = await User.updateOne(
      { _id: receiverInfo._id },
      { $push: { notifications: notification._id } }
    );
    if (userUpdate.modifiedCount === 0) {
      await Notification.deleteOne({ _id: notification._id });
      return res.status(500).json({
        status: "error",
        message: "Unexpected Error Occurred.",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Request Sent SuccessFully",
      data: newRequest,
    });
  } catch (e) {
    console.log(e.message)
    res.status(500).json({ status: "error", message: "Internal Sever Error", data: null });
  }
};

const getPendingFriendRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId }).populate(
      "pendingFriendRequests"
    );
    const friends = user.pendingFriendRequests;
    const resArray = friends.map((friend) => {
      return {
        _id: friend._id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        email: friend.email,
        profilePicture: friend.profilePicture,
      };
    });
    return res.status(200).json({
      message: "Pending Requests Fetched Successfully",
      data: resArray,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getSentFriendRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId }).populate(
      "sentFriendRequests"
    );
   
    const friends = user.sentFriendRequests;
    const resArray = friends.map((friend) => {
      return {
        _id: friend._id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        email: friend.email,
        profilePicture: friend.profilePicture,
      };
    });
    return res
      .status(200)
      .json({ message: "Sent Requests Fetched Successfully", data: resArray });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId }).populate("friends");
    const friends = user.friends;
    if (friends.length === 0) {
      return res
        .status(204)
        .json({ message: "User has no friends!", data: friends });
    }
    const resArray = friends.map((friend) => {
      return {
        _id: friend._id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        email: friend.email,
        profilePicture: friend.profilePicture,
      };
    });

    return res
      .status(200)
      .json({ message: "Friend List Fetched Successfully", data: resArray });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteFriend = async (req, res) => {
  try {
    const { friendUserId } = req.body;
    if (!friendUserId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Friend's User Id",
        data: null,
      });
    }
    const userId = req.userId;
    const operation = await User.updateMany(
      { _id: { $in: [userId, friendUserId] } },
      { $pull: { friends: { $in: [userId, friendUserId] } } }
    );

    if (operation.matchedCount !== 2) {
      return res.status(404).json({
        status: "error",
        message: "One or both users not found.",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Friend Deleted Successfully",
      data: null,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error", data: null });
  }
};

const cancelRequestSent = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const userId = req.userId;
    const responseObj = await User.findOne({ _id: userId }).select(
      "sentFriendRequests"
    );
    if (!responseObj.sentFriendRequests.includes(receiverId)) {
      return res
        .status(400)
        .json({status:'error', message: "Cannot cancel the sent request", data:null });
    }
    await Promise.all([
      User.updateOne(
        { _id: userId },
        { $pull: { sentFriendRequests: receiverId } }
      ),
      User.updateOne(
        { _id: receiverId },
        { $pull: { pendingFriendRequests: userId } }
      ),
    ]);
    return res.status(200).json({status:"success", message: "Request Cancelled Successfully", data:null });
  } catch (e) {
    console.log(e.message)
    return res.status(500).json({status:'error', message: "Internal Server Error", data:null });
  }
};

const respondFriendRequest = async(req, res) => {
  try {
    const { senderId, response } = req.body;
    const receiverId = req.userId;
    const responseObj = await User.findOne({ _id: receiverId }).select(
      "pendingFriendRequests friends"
    );
    const pendingFriendRequests = responseObj.pendingFriendRequests;
    const friends = responseObj.friends;
    if (friends.includes(senderId)) {
      return res.status(400).json({status:"error", message: "Users are already friends", data:null });
    }
    if (!pendingFriendRequests.includes(senderId)) {
      return res
        .status(400)
        .json({status:"error", message: "User hasn't sent friend request", data:null });
    }

    if (response === "Accept") {
      await Promise.all([
        User.updateOne(
          { _id: receiverId },
          {
            $pull: { pendingFriendRequests: senderId },
            $push: { friends: senderId }
          }
        ),
       
        User.updateOne(
          { _id: senderId },
          {
            $pull: { sentFriendRequests: receiverId },
            $push: { friends: receiverId }
          }
        ),
      ]);
      return res.status(200).json({status:"success", message: "Request Accepted Successfully", data:null });
    } else if (response === "Reject") {
      Promise.all([
        User.updateOne(
          { _id: receiverId },
          {
            $pull: { pendingFriendRequests: senderId },
          }
        ),
        User.updateOne(
          { _id: senderId },
          {
            $pull: { sentFriendRequests: receiverId },
          }
        ),
      ]);
      return res.status(200).json({status:'success', message: "Request Rejected Successfully", data:null });
    } else {
      return res.status(400).json({status:'error', message: "Invalid Action", data:null });
    }
  } catch (e) {
    return res.status(500).json({status:'error',  message: "Internal Server Error" , data:null });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { changedFields } = req.body;
    if (Object.keys(changedFields).length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Atleat one field is required to update!",
        data: null,
      });
    }
    if (changedFields.email) {
      return res.status(401).json({
        status: "error",
        message: "Email cannot be updated",
        data: null,
      });
    }

    const userId = req.userId;
    const update = await User.updateOne(
      { _id: userId },
      { $set: changedFields }
    );

    if (update.modifiedCount === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found", data: null });
    }
    return res.status(200).json({
      status: "success",
      message: "UserInfo Updated Successfully",
      data: null,
    });
  } catch (e) {
    console.log(e.messaage);
    return res
      .status(500)
      .json({ status: "error", message: "Something went wrong!", data: null });
  }
};

module.exports = {
  sendFriendRequest,
  getPendingFriendRequests,
  getSentFriendRequests,
  getFriends,
  cancelRequestSent,
  respondFriendRequest,
  updateUserInfo,
  getUserDetails,
  deleteFriend,
};
