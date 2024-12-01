const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");

router.get("/getall/:id", NotificationController.getNotification);
module.exports = router;
