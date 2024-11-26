const TaskService = require("../services/TaskService");
const moment = require("moment-timezone");
const createTask = async (req, res) => {
  try {
    const {
      name,
      projectId,
      dueDate,
      assignees, // Thay đổi thành assignees
      priority,
      status,
      description,
    } = req.body;

    // Kiểm tra các giá trị bắt buộc
    if (
      !name ||
      !projectId ||
      !dueDate ||
      !assignees ||
      assignees.length === 0
    ) {
      return res.status(400).json({
        status: "ERR",
        message:
          "Required fields are missing: name, projectId, dueDate, assignees",
      });
    }
    // Chuyển đổi dueDate về UTC
    const dueDateUTC = moment.utc(dueDate);
    if (!dueDateUTC.isValid()) {
      return res.status(400).json({
        status: "ERR",
        message: "Invalid due date format",
      });
    }
    // Gọi service để tạo task
    const response = await TaskService.createTask({
      ...req.body,
      dueDate: dueDateUTC.toDate(), // Chuyển đổi về định dạng UTC
    });
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "ERR",
      message: "Something went wrong",
    });
  }
};
const getAllTask = async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return res.status(200).json({
        status: "ERR",
        message: "Project ID is required",
      });
    }
    const response = await TaskService.getAllTask(projectId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getDetailTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({
        status: "ERR",
        message: "TaskID is required",
      });
    }
    const response = await TaskService.getDetailTask(taskId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({
        status: "ERR",
        message: "TaskID is required",
      });
    }
    const response = await TaskService.updateTask(taskId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: e,
    });
  }
};
const addSubtask = async (req, res) => {
  try {
    const taskId = req.params.id; //
    if (!taskId) {
      return res.status(400).json({
        status: "ERR",
        message: "TaskID is required",
      });
    }
    const response = await TaskService.addSubtask(taskId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "ERR",
      message: "Something went wrong",
    });
  }
};
const deleteTask = async (req, res) => {
  try {
    const { taskIds } = req.body;
    if (!taskIds) {
      return res.status(400).json({
        status: "ERR",
        message: "TaskID is required",
      });
    }
    const response = await TaskService.deleteTask(taskIds);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "ERR",
      message: "Something went wrong",
    });
  }
};
const deleteSubTask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params; //
    if (!taskId || !subtaskId) {
      return res.status(400).json({
        status: "ERR",
        message: "TaskID or SubtaskID is required",
      });
    }
    const response = await TaskService.deleteSubtask(taskId, subtaskId);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "ERR",
      message: "Something went wrong",
    });
  }
};
const updateStatusSubtask = async (req, res) => {
  try {
    const { status } = req.body;
    const { taskId, subtaskId, userId } = req.params; // Lấy taskId và subtaskId từ params
    if (!taskId || !userId || !subtaskId || !status) {
      return res.status(400).json({
        status: "ERR",
        message: "TaskID or UserID is required",
      });
    }
    const response = await TaskService.updateStatusSubtask(
      taskId,
      subtaskId,
      userId,
      status
    );
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: e,
    });
  }
};
const updateStatusTask = async (req, res) => {
  try {
    const { taskId, userId } = req.params; // Lấy taskId và subtaskId từ params
    const { status } = req.body;
    if (!taskId || !userId || !status) {
      return res.status(400).json({
        status: "ERR",
        message: "Input is required",
      });
    }
    const response = await TaskService.updateStatusTask(taskId, userId, status);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createTask,
  getAllTask,
  getDetailTask,
  updateTask,
  updateStatusTask,
  updateStatusSubtask,
  addSubtask,
  deleteTask,
  deleteSubTask,
};
