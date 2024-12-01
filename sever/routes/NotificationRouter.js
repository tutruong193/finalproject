const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");

router.post("/create", NotificationController.createNotification);
router.get("/getall/:id", NotificationController.getNotification);
module.exports = router;
