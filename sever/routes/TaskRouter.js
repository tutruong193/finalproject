const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");

router.get("/getall", TaskController.getAllTask);
router.post("/create", TaskController.createTask);
router.delete("/delete", TaskController.deleteTask);
router.post("/create-subtask/:id", TaskController.addSubtask);
router.delete(
  "/delete/task/:taskId/subtask/:subtaskId",
  TaskController.deleteSubTask
);
router.get("/detail/:id", TaskController.getDetailTask);
router.put("/update/:id", TaskController.updateTask);
router.put(
  "/update_status/task/:taskId/subtask/:subtaskId/user/:userId",
  TaskController.updateStatusSubtask
);
router.put(
  "/update_status/task/:taskId/user/:userId",
  TaskController.updateStatusTask
);
module.exports = router;
