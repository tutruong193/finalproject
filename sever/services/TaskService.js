const Task = require("../models/TaskModel");
const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");
const createTask = (data) => {
  return new Promise(async (resolve, reject) => {
    const {
      taskName,
      projectId,
      dueDate,
      assigneeId,
      priority,
      status,
      description,
    } = data;

    try {
      // Kiểm tra projectId có tồn tại không
      const project = await Project.findById(projectId);
      if (!project) {
        return resolve({
          status: "ERR",
          message: "Project not found",
        });
      }

      // Kiểm tra danh sách assigneeId có hợp lệ không
      const validAssignees = await User.find({ _id: { $in: assigneeId } });
      if (validAssignees.length !== assigneeId.length) {
        return resolve({
          status: "ERR",
          message: "One or more assignees are invalid",
        });
      }

      // Tạo task mới
      const createdTask = await Task.create({
        taskName,
        projectId,
        assigneeId,
        dueDate,
        priority: priority || "medium", // nếu không có giá trị thì dùng mặc định là "medium"
        status: status || "pending", // nếu không có giá trị thì dùng mặc định là "pending"
        description: description || "",
      });

      resolve({
        status: "OK",
        message: "Task created successfully",
        data: createdTask,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllTask = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Task.find({ projectId: id });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: data,
      });
    } catch (error) {
      throw error;
    }
  });
};
module.exports = {
  createTask,
  getAllTask,
};
