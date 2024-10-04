const Task = require("../models/TaskModel");
const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");
const createTask = (data) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      projectId,
      dueDate,
      assignees, // Sử dụng mảng assignees
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
      const checkTask = await Task.findOne({ name: name });
      if (checkTask !== null) {
        return resolve({
          status: "ERR",
          message: "Task has already had",
        });
      }

      // Lấy danh sách userId từ mảng assignees
      const assigneeIds = assignees.map((assignee) => assignee.userId);

      // Kiểm tra danh sách assignees có hợp lệ không
      const validAssignees = await User.find({ _id: { $in: assigneeIds } });
      if (validAssignees.length !== assigneeIds.length) {
        return resolve({
          status: "ERR",
          message: "One or more assignees are invalid",
        });
      }
      // Tạo task mới
      const createdTask = await Task.create({
        name,
        projectId,
        assignees,
        dueDate,
        priority,
        status,
        description,
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
