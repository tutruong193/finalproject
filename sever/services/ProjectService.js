const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");
const Task = require("../models/TaskModel");
const moment = require("moment-timezone");
const NotificationService = require("../services/NotificationService");
const createProject = (data) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      description,
      managerID,
      members,
      startDate,
      endDate,
      status,
    } = data;
    try {
      const checkName = await Project.findOne({ name: name });
      if (checkName !== null) {
        return resolve({
          status: "ERR",
          message: "The project name is already in use",
        });
      }
      const checkUser = await User.findOne({ _id: managerID });
      if (!checkUser) {
        return resolve({
          status: "ERR",
          message: "This manager account does not exist",
        });
      }
      const validMembers = await Promise.all(
        members.map(async (member) => {
          const user = await User.findById(member.userId);
          if (user && user.role.includes("member")) {
            return { userId: member.userId, name: user.name, role: user.role };
          } else {
            return null;
          }
        })
      );
      if (validMembers.includes(null)) {
        return resolve({
          status: "ERR",
          message: "One or more members are invalid or have an incorrect role",
        });
      }
      const createdProject = await Project.create({
        name,
        description,
        managerID,
        members: validMembers,
        startDate,
        endDate,
        status,
      });
      // Nếu tạo thành công, trả về kết quả
      if (createdProject) {
        await NotificationService.createNotification(
          createdProject?._id,
          createdProject?.members,
          `Project ${name} is created successfully`
        );
        return resolve({
          status: "OK",
          message: "Project created successfully",
          data: createdProject,
        });
      }
    } catch (e) {
      // Trả về lỗi nếu có ngoại lệ xảy ra
      return reject({
        status: "ERR",
        message: "An error occurred during project creation",
        error: e,
      });
    }
  });
};
const getAllProject = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Project.find();
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
const deleteProject = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        return resolve({
          status: "ERR",
          message: "Project not found",
        });
      }
      const deletedTasks = await Task.find({ projectId: id });
      if (deletedTasks.length > 0) {
        await Promise.all(
          deletedTasks.map(async (task) => {
            await Task.findByIdAndDelete(task._id);
          })
        );
      }
      resolve({
        status: "OK",
        message: "Project and related tasks deleted successfully",
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};
const getDetailProject = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const detailProject = await Project.findOne({ _id: id });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: detailProject,
      });
    } catch (error) {
      throw error;
    }
  });
};
const updateProject = (id, data) => {
  return new Promise(async (resolve, reject) => {
    const { name, description, members, startDate, endDate, status } = data;
    try {
      const currentProject = await Project.findById(id);
      if (!currentProject) {
        return resolve({
          status: "ERR",
          message: "Project not found",
        });
      }
      // Kiểm tra xem dữ liệu mới có giống hoàn toàn dữ liệu hiện tại không
      const isSameData =
        currentProject.name === name &&
        currentProject.description === description &&
        JSON.stringify(currentProject.members) === JSON.stringify(members) &&
        currentProject.startDate.toISOString() ===
          new Date(startDate).toISOString() &&
        currentProject.endDate.toISOString() ===
          new Date(endDate).toISOString() &&
        currentProject.status === status;
      if (isSameData) {
        return resolve({
          status: "ERR",
          message: "No changes detected, project remains the same.",
        });
      }
      const checkName = await Project.findOne({ name: name, _id: { $ne: id } });
      if (checkName) {
        return resolve({
          status: "ERR",
          message: "The project name is already in use by another project.",
        });
      }
      const validMembers = await Promise.all(
        members.map(async (member) => {
          const user = await User.findById(member.userId);
          if (user && user.role.includes("member")) {
            return { userId: member.userId, name: user.name, role: user.role };
          } else {
            return null;
          }
        })
      );
      if (validMembers.includes(null)) {
        return resolve({
          status: "ERR",
          message: "One or more members are invalid or have an incorrect role",
        });
      }
      currentProject.name = name;
      currentProject.description = description;
      currentProject.members = validMembers;
      currentProject.startDate = new Date(startDate); // Đảm bảo là đối tượng Date
      currentProject.endDate = new Date(endDate); // Đảm bảo là đối tượng Date
      currentProject.status = status;
      const updatedProject = await currentProject.save();
      if (updatedProject) {
        return resolve({
          status: "OK",
          message: "Project updated successfully",
          data: updatedProject,
        });
      }
    } catch (e) {
      // Trả về lỗi nếu có ngoại lệ xảy ra
      return reject({
        status: "ERR",
        message: "An error occurred during project creation",
        error: e,
      });
    }
  });
};
const addMemberToProject = (id, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById(userId);
      if (!checkUser) {
        return resolve({
          status: "ERR",
          message: "This user account does not exist",
        });
      }
      const project = await Project.findById(id);
      if (!project) {
        return resolve({
          status: "ERR",
          message: "This project does not exist",
        });
      }

      // Kiểm tra nếu user đã là thành viên của dự án
      if (project.members.includes(userId)) {
        return resolve({
          status: "ERR",
          message: "User is already a member of this project",
        });
      }
      // Thêm user vào danh sách members của project
      project.members.push({
        userId: userId,
        name: checkUser.name, // Lưu tên của người dùng
      });
      await project.save();

      return resolve({
        status: "OK",
        message: "User added to project successfully",
      });
    } catch (e) {
      // Trả về lỗi nếu có ngoại lệ xảy ra
      return reject({
        status: "ERR",
        message: "An error occurred during project creation",
        error: e,
      });
    }
  });
};
const deleteMemberFromProject = (id, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById(userId);
      if (!checkUser) {
        return resolve({
          status: "ERR",
          message: "This user account does not exist",
        });
      }
      const project = await Project.findById(id);
      if (!project) {
        return resolve({
          status: "ERR",
          message: "This project does not exist",
        });
      }

      // Kiểm tra nếu user không phải là thành viên của dự án
      const memberIndex = project.members.findIndex(
        (member) => member.userId.toString() === userId
      );
      if (memberIndex === -1) {
        return resolve({
          status: "ERR",
          message: "User is not a member of this project",
        });
      }

      // Xóa user khỏi danh sách members của project
      project.members.splice(memberIndex, 1);
      await project.save();

      const tasks = await Task.find({ projectId: id });

      for (const task of tasks) {
        // Xóa user khỏi danh sách assignees trong task
        const assigneeIndex = task.assignees.findIndex(
          (assignee) => assignee.userId.toString() === userId
        );
        if (assigneeIndex !== -1) {
          task.assignees.splice(assigneeIndex, 1);
        }
        if (task.subtasks && task.subtasks.length > 0) {
          for (const subtask of task.subtasks) {
            const subAssigneeIndex = subtask.assignees.findIndex(
              (assignee) => assignee.userId.toString() === userId
            );
            if (subAssigneeIndex !== -1) {
              subtask.assignees.splice(subAssigneeIndex, 1);
            }
          }
        }
        await task.save();
      }
      return resolve({
        status: "OK",
        message:
          "User removed from project and all associated tasks/subtasks successfully",
      });
    } catch (e) {
      return reject({
        status: "ERR",
        message: "An error occurred while deleting member from project",
        error: e,
      });
    }
  });
};

// Hàm kiểm tra các project hết hạn
const checkProjects = async () => {
  try {
    const now = new Date(); // Thời gian hiện tại

    // 1. Tìm các project có trạng thái "progress" và kiểm tra xem có hết hạn không
    const projectsInProgress = await Project.find({
      status: "progress",
    });

    for (let project of projectsInProgress) {
      if (project.endDate < now) {
        // Dự án đã hết hạn, kiểm tra các task liên quan
        const projectTasks = await Task.find({ projectId: project._id });

        const allTasksCompleted = projectTasks.every(
          (task) => task.status === "completed"
        );

        if (allTasksCompleted) {
          // Nếu tất cả task đã hoàn thành, đổi trạng thái thành "completed"
          project.status = "completed";
        } else {
          // Nếu có task chưa hoàn thành, đổi trạng thái thành "incompleted"
          project.status = "incompleted";
        }

        await project.save(); // Lưu project sau khi cập nhật trạng thái
      }
    }

    // 2. Tìm các project có trạng thái "pending" và kiểm tra nếu cần đổi thành "progress"
    const pendingProjects = await Project.find({
      status: "pending",
    });

    for (let project of pendingProjects) {
      if (project.startDate < now && project.endDate > now) {
        // Nếu thời gian hiện tại nằm giữa startDate và endDate, chuyển thành "progress"
        project.status = "progress";
        await project.save(); // Lưu project sau khi cập nhật
      }
    }
  } catch (error) {
    console.error("Error checking project status:", error);
  }
};
// Tự động chạy hàm kiểm tra mỗi phút
setInterval(checkProjects, 60 * 1000); // 60 * 1000 = 1 phút
module.exports = {
  createProject,
  getAllProject,
  deleteProject,
  getDetailProject,
  updateProject,
  addMemberToProject,
  deleteMemberFromProject,
};
