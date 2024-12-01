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
        members.map(async (memberId) => {
          const user = await User.findById(memberId);
          if (user && user.role.includes("member")) {
            return user._id;
          }
          return null;
        })
      );
      if (validMembers.some((member) => member === null)) {
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
      if (createdProject) {
        await NotificationService.createNotification(
          createdProject?._id,
          `Project ${name} is created successfully`
        );
        return resolve({
          status: "OK",
          message: "Project created successfully",
          data: createdProject,
        });
      }
    } catch (e) {
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
      await NotificationService.createNotification(
        id,
        `Project ${project?.name} is deleted successfully`
      );
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
        await NotificationService.createNotification(
          updatedProject._id,
          `Project ${updatedProject?.name} is updated at ${updatedProject.updatedAt}`
        );
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
      project.members.push(userId);
      await project.save();
      const user = await User.findById(userId);
      await NotificationService.createNotification(
        id,
        `Manager adding ${user?.name} to project ${project?.name} `
      );
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
      const memberIndex = project.members.findIndex(
        (member) => member.toString() === userId
      );
      if (memberIndex === -1) {
        return resolve({
          status: "ERR",
          message: "User is not a member of this project",
        });
      }

      project.members.splice(memberIndex, 1);
      await project.save();
      const tasks = await Task.find({ projectId: id });
      for (const task of tasks) {
        if (task.assignees.toString() === userId) {
          await Task.findByIdAndDelete(task._id);
        }
      }
      const user = await User.findById(userId);
      await NotificationService.createNotification(
        id,
        `Manager removing ${user?.name} from project ${project?.name}`
      );
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

const checkProjects = async () => {
  try {
    const now = new Date();
    const projectsInProgress = await Project.find({
      status: "progress",
    });

    for (let project of projectsInProgress) {
      if (project.endDate < now) {
        const projectTasks = await Task.find({ projectId: project._id });

        const allTasksCompleted = projectTasks.every(
          (task) => task.status === "completed"
        );

        if (allTasksCompleted) {
          await NotificationService.createNotification(
            projectsInProgress?._id,
            `Project ${projectsInProgress?.name} is completed`
          );
          project.status = "completed";
        } else {
          project.status = "incompleted";
          await NotificationService.createNotification(
            projectsInProgress?._id,
            `Project ${projectsInProgress?.name} is incompleted`
          );
        }

        await project.save();
      }
    }
    const pendingProjects = await Project.find({
      status: "pending",
    });

    for (let project of pendingProjects) {
      if (project.startDate < now && project.endDate > now) {
        project.status = "progress";
        await NotificationService.createNotification(
          pendingProjects?._id,
          `Project ${pendingProjects?.name} is stared`
        );
        await project.save();
      }
    }
  } catch (error) {
    console.error("Error checking project status:", error);
  }
};

setInterval(checkProjects, 60 * 1000);
module.exports = {
  createProject,
  getAllProject,
  deleteProject,
  getDetailProject,
  updateProject,
  addMemberToProject,
  deleteMemberFromProject,
};
