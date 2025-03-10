const Event = require("../models/eventsModel");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const addEvents = async (req, res) => {
  try {
    const { title, start, end, description } = req.body;

    const userId = req.userId;
    if (!title || !start || !end || !description) {
      return res.status(400).json({ message: "All Fields are required!" });
    }
    const startDate = new Date(`${start}`);
    const endDate = new Date(`${end}`);

    if (startDate > endDate) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Start Date cannot be greater than endDate",
          data: null,
        });
    }
    const newEvent = {
      userId,
      title,
      start: startDate,
      end: endDate,
      description,
    };

    const addedEvent = await Event.create(newEvent);
    await User.updateOne(
      { _id: userId },
      { $push: { events: addedEvent._id } }
    );
    const responseObj = {
      id: addedEvent._id,
      title: addedEvent.title,
      start: addedEvent.start,
      end: addedEvent.end,
      description: addedEvent.description,
    };
    return res
      .status(201)
      .json({
        status: "sucess",
        message: "Event Created Sucessfully",
        data: responseObj,
      });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: e.message, data: null });
  }
};
const getEvents = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate("events");
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found", data: null });
    }

    const events = user.events;

    const resArray = events.map((event) => {
      return {
        id: event._id,
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.description,
      };
    });

    return res.status(200).json({
      status: "success",
      message: "Events Fetched Successfully",
      data: resArray,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: e.message, data: null });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id, title, start, end, description } = req.body;

    if (!id || !title || !start || !end || !description) {
      return res.status(400).json({
        status: "error",
        message: "Required fields are missing",
        data: null,
      });
    }
    const userId = req.userId;

    const event = await Event.findOne({ _id: id }).select("userId");
    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
        data: null,
      });
    }

    if (event.userId.toString() !== userId) {
      return res.status(403).json({
        status: "error",
        message: "You don't have permission to edit this event",
        data: null,
      });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate > endDate) {
      return res.status(400).json({
        status: "error",
        message: "Start date cannot be after end date",
        data: null,
      });
    }

    const updatedResult = await Event.updateOne(
      { _id: id },
      {
        $set: {
          title: title,
          start: startDate,
          end: endDate,
          description: description,
        },
      }
    );

    if (updatedResult.modifiedCount === 0) {
      return res.status(400).json({
        status: "error",
        message: "Event update failed",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Event updated successfully",
      data: { id, title, start: startDate, end: endDate, description },
    });
  } catch (e) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      errors: { details: e.message },
      data: null,
    });
  }
};

const deleteEvents = async (req, res) => {
  try {
    const { eventsToDelete } = req.body;
    const userId = req.userId;
    const deletion = await Event.deleteMany({
      _id: { $in: eventsToDelete },
      userId: userId,
    });
    await User.updateOne(
      { _id: userId },
      { $pullAll: { events: eventsToDelete } }
    );
    if (deletion.deletedCount !== eventsToDelete.length) {
      return res
        .status(200)
        .json({
          status: "sucess",
          message: "Some Events Couldn't be Deleted!",
          data: null,
        });
    }

    return res
      .status(200)
      .json({
        status: "sucess",
        message: "Events Deleted Sucessfully",
        data: null,
      });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", message: e.message, data: null });
  }
};

module.exports = { addEvents, getEvents, updateEvent, deleteEvents };
