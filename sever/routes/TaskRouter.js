const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");

router.get("/getall", TaskController.getAllTask);
router.post("/create", TaskController.createTask);
router.delete("/delete", TaskController.deleteTasks);
router.delete("/delete/:id", TaskController.deleteTask);
router.post("/create-subtask/:id", TaskController.addSubtask);
router.delete(
  "/delete/task/:taskId/subtask/:subtaskId",
  TaskController.deleteSubTask
);
router.get("/detail/:id", TaskController.getDetailTask);
router.put(
  "/update_status/task/:taskId/subtask/:subtaskId/user/:userId",
  TaskController.updateStatusSubtask
);
router.put(
  "/update_status/task/:taskId/user/:userId",
  TaskController.updateStatusTask
);

router.put(
  "/addassignee/task/:taskId/user/:userId",
  TaskController.addAssigneeTask
);
router.put(
  "/removeassignee/task/:taskId/user/:userId",
  TaskController.removeAssigneeTask
);
module.exports = router;
