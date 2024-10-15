const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");

router.get("/getall", TaskController.getAllTask);
router.post("/create", TaskController.createTask);
router.delete("/delete/:id", TaskController.deleteTask);
router.post("/create-subtask/:id", TaskController.addSubtask);
router.delete(
  "/delete/task/:taskId/subtask/:subtaskId",
  TaskController.deleteSubTask
);
router.get("/detail/:id", TaskController.getDetailTask);
router.put("/update/:id", TaskController.updateTask);
router.put("/tasks/:taskId/status/:subtaskId?", TaskController.updateStatus);
module.exports = router;
