const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventControllers");
router
  .post("/addEvent", eventController.addEvents)
  .get("/getEvents", eventController.getEvents)
  .patch("/updateEvent", eventController.updateEvent)
  .delete("/deleteEvents", eventController.deleteEvents);
module.exports = router;
