const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");

router.get("/getall", TaskController.getAllTask);
router.post("/create", TaskController.createTask);
router.get("/detail/:id", TaskController.getDetailTask);
router.put("/update/:id", TaskController.updateTask);
module.exports = router;
