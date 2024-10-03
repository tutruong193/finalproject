const TaskService = require("../services/TaskService");
const createTask = async (req, res) => {
  try {
    const {
      taskName,
      projectId,
      dueDate,
      assigneeId,
      priority,
      status,
      description,
    } = req.body;

    // Kiểm tra các giá trị bắt buộc
    if (
      !taskName ||
      !projectId ||
      !dueDate ||
      !assigneeId ||
      assigneeId.length === 0
    ) {
      return res.status(400).json({
        status: "ERR",
        message:
          "Required fields are missing: taskName, projectId, dueDate, assigneeId",
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

module.exports = {
  createTask,
  getAllTask,
};
