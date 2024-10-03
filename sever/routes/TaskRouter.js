const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");

router.get("/getall", TaskController.getAllTask);
router.post("/create", TaskController.createTask);

module.exports = router;
