const TaskService = require("../services/TaskService");
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

    // Gọi service để tạo task
    const response = await TaskService.createTask(req.body);
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
module.exports = {
  createTask,
  getAllTask,
  getDetailTask,
  updateTask,
};
