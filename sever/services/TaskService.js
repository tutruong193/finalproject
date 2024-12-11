const Task = require("../models/TaskModel");
const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const NotificationService = require("../services/NotificationService");
const createTask = (data) => {
  return new Promise(async (resolve, reject) => {
    const { name, projectId, dueDate, assignees, description } = data;
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        return resolve({
          status: "ERR",
          message: "Project not found",
        });
      }
      const dueDateUTC = moment.utc(dueDate);
      const projectEndDate = moment.utc(project.endDate);
      const projectStartDate = moment.utc(project.startDate);
      const currentDateUTC = moment.utc();
      if (projectEndDate < dueDateUTC) {
        return resolve({
          status: "ERR",
          message: `Due date of task "${name}" cannot be later than the project end date`,
        });
      }
      if (projectStartDate > dueDateUTC) {
        return resolve({
          status: "ERR",
          message: `Due date of task "${name}" cannot be earlier than the project start date`,
        });
      }
      const checkTask = await Task.findOne({
        name: name,
        projectId: projectId,
      });
      if (checkTask !== null) {
        return resolve({
          status: "ERR",
          message: "Task has already had",
        });
      }
      const isMember = project.members.includes(assignees);
      if (!isMember) {
        return resolve({
          status: "ERR",
          message: "Assignee is not a valid member of this project",
        });
      }
      // Tạo task mới
      const createdTask = await Task.create({
        name,
        projectId,
        assignees,
        dueDate,
        description,
      });
      await NotificationService.createNotification(
        projectId,
        `Project ${project?.name} is adding a new task`
      );
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
const getDetailTask = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const detailTask = await Task.findOne({ _id: id });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: detailTask,
      });
    } catch (error) {
      throw error;
    }
  });
};
const addSubtask = async (id, data) => {
  return new Promise(async (resolve, reject) => {
    const { name, dueDate } = data;
    try {
      const task = await Task.findById(id);
      if (!task) {
        return resolve({
          status: "ERR",
          message: "Task not found",
        });
      }
      const project = await Project.findById(task.projectId);
      if (new Date(project.startDate) > new Date(dueDate)) {
        return resolve({
          status: "ERR",
          message: `Due date of subtask "${name}" cannot be elier than the project start date`,
        });
      }
      if (
        new Date(task.dueDate) < new Date(dueDate) ||
        new Date(project.endDate) < new Date(dueDate)
      ) {
        return resolve({
          status: "ERR",
          message: `Due date of task "${name}" cannot be later than the project end date or the task duedate`,
        });
      }
      if (task.subtasks.includes(name)) {
        return resolve({
          status: "ERR",
          message: `A subtask with the name "${name}" already exists in this task`,
        });
      }
      task.subtasks.push({
        name,
        dueDate,
        assignees: task.assignees,
      });
      await task.save();
      await NotificationService.createNotification(
        project?._id,
        `Project ${project?.name} adding a new subtask in ${task?.name} `
      );
      resolve({
        status: "OK",
        message: "Subtask added successfully",
      });
    } catch (error) {
      throw error;
    }
  });
};
const deleteTasks = async (taskIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (taskIds.length === 0) {
        return resolve({
          status: "ERR",
          message: "Invalid input: taskIds must be a non-empty array",
        });
      }
      for (const taskId of taskIds) {
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
          return resolve({
            status: "ERR",
            message: `Task with ID ${taskId} not found`,
          });
        }
      }
      return resolve({
        status: "OK",
        message: "All tasks deleted successfully",
      });
    } catch (error) {
      return reject({
        status: "ERR",
        message: "An error occurred while deleting tasks",
        error: error,
      });
    }
  });
};
const deleteSubtask = async (taskId, subtaskId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra nếu taskId không hợp lệ
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return resolve({
          status: "ERR",
          message: "Invalid taskId",
        });
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return resolve({
          status: "ERR",
          message: "Task not found",
        });
      }

      const subtaskIndex = task.subtasks.findIndex(
        (subtask) => subtask.id === subtaskId
      );

      if (subtaskIndex === -1) {
        return resolve({
          status: "ERR",
          message: "Subtask not found",
        });
      }

      // Xóa subtask
      task.subtasks.splice(subtaskIndex, 1);
      await task.save();
      await NotificationService.createNotification(
        task?.projectId,
        `Project deleting subtask from ${task?.name} task`
      );
      resolve({
        status: "OK",
        message: "Subtask deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting subtask:", error);
      reject({
        status: "ERR",
        message: "Server error",
      });
    }
  });
};
const updateStatusSubtask = async (taskId, subtaskId, userId, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const task = await Task.findOne({ _id: taskId });
      if (!task) {
        return resolve({
          status: "ERR",
          message: "Task not found",
        });
      }
      const project = await Project.findById(task.projectId);
      if (project.status === "pending") {
        return resolve({
          status: "ERR",
          message: "Project are not started yet",
        });
      }
      if (project.managerID.toString() !== userId) {
        if (task.assignees.toString() !== userId) {
          return resolve({
            status: "ERR",
            message: "User not assigned to this task",
          });
        }
      }
      const subtask = task.subtasks.id(subtaskId);
      if (!subtask) {
        return resolve({
          status: "ERR",
          message: "Subtask not found",
        });
      }
      const currentDate = new Date();
      if (!(currentDate < subtask.dueDate)) {
        return resolve({
          status: "ERR",
          message: "Subtask out of date",
        });
      }
      if (status === "done") {
        subtask.status = "done";
        const isAllSubtaskDone = task.subtasks.every(
          (st) => st.status === "done"
        );
        if (isAllSubtaskDone) {
          task.status = "done";
        }
      }
      if (status === "progress") {
        subtask.status = "progress";
        task.status = "progress";
      }
      if (status === "todo") {
        subtask.status = "todo";
        if (task.status === "done") {
          task.status = "progress";
        }
      }
      await task.save();
      const tasks = await Task.find({
        projectId: task.projectId,
      });
      const allTasksCompleted = tasks.every((t) => t.status === "done");
      // Nếu tất cả tasks đã hoàn thành, cập nhật trạng thái của project thành "completed"
      if (allTasksCompleted) {
        await Project.findByIdAndUpdate(task.projectId, {
          status: "done",
        });
      } else {
        await Project.findByIdAndUpdate(task.projectId, {
          status: "progress",
        });
      }
      const user = await User.findById(userId);
      await NotificationService.createNotification(
        project?._id,
        `${user.name} update ${subtask.name} subtask status`
      );
      resolve({
        status: "OK",
        message: "Subtask status updated successfully",
      });
    } catch (error) {
      return reject({
        status: "ERR",
        message: "An error occurred during subtask status update",
        error,
      });
    }
  });
};
const updateStatusTask = async (taskId, userId, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const task = await Task.findOne({ _id: taskId });
      if (!task) {
        return resolve({
          status: "ERR",
          message: "Task not found",
        });
      }
      const project = await Project.findById(task.projectId);
      if (project.status === "pending") {
        return resolve({
          status: "ERR",
          message: "Project are not started yet",
        });
      }
      if (project.managerID.toString() !== userId) {
        if (task.assignees === null) {
          return resolve({
            status: "ERR",
            message: "This task not assigned to anyone",
          });
        }
        if (task.assignees.toString() !== userId) {
          return resolve({
            status: "ERR",
            message: "User not assigned to this task",
          });
        }
      }
      const currentDate = new Date();
      if (!(currentDate < task.dueDate)) {
        return resolve({
          status: "ERR",
          message: "Task out of date",
        });
      }
      if (task.subtasks && task.subtasks.length > 0) {
        if (status === "done") {
          const allSubtasksDone = task.subtasks.every(
            (subtask) => subtask.status === "done"
          );
          if (!allSubtasksDone) {
            return resolve({
              status: "ERR",
              message: "All subtasks must be done before marking task as done.",
            });
          }
          task.status = status;
        }
        if (status === "progress") {
          task.status = "progress";
          task.subtasks.forEach((subtask) => {
            if (subtask.status === "done") {
              subtask.status = "progress";
            }
          });
        }
        if (status === "todo") {
          task.status = status;
          task.subtasks.forEach((subtask) => {
            subtask.status = status;
          });
        }
      } else {
        task.status = status;
      }
      await task.save();
      const tasks = await Task.find({
        projectId: task.projectId,
      });
      const allTasksCompleted = tasks.every((t) => t.status === "done");
      // Nếu tất cả tasks đã hoàn thành, cập nhật trạng thái của project thành "completed"
      if (allTasksCompleted) {
        await Project.findByIdAndUpdate(task.projectId, {
          status: "done",
        });
      } else {
        await Project.findByIdAndUpdate(task.projectId, {
          status: "progress",
        });
      }
      const user = await User.findById(userId);
      await NotificationService.createNotification(
        project?._id,
        `${user.name} update ${task.name} task status`
      );
      resolve({
        status: "OK",
        message: "Task status updated successfully",
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message,
      });
    }
  });
};
const deleteTask = async (taskId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const task = await Task.findByIdAndDelete(taskId);
      await NotificationService.createNotification(
        task?.projectId,
        `Project deleting ${task?.name} task`
      );
      return resolve({
        status: "OK",
        message: "All tasks deleted successfully",
      });
    } catch (error) {
      return reject({
        status: "ERR",
        message: "An error occurred while deleting tasks",
        error: error,
      });
    }
  });
};
const addAssigneeTask = async (taskId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const task = await Task.findOne({ _id: taskId });
      if (!task) {
        return resolve({
          status: "ERR",
          message: "Task not found",
        });
      }
      const project = await Project.findById(task.projectId);
      if (!project.members.includes(userId)) {
        return resolve({
          status: "ERR",
          message: "This member is not a member of this project",
        });
      }
      if (task.assignees) {
        return resolve({
          status: "ERR",
          message: "This task already has member",
        });
      }
      const currentDate = new Date();
      if (!(currentDate < task.dueDate)) {
        return resolve({
          status: "ERR",
          message: "Task out of date to assign",
        });
      }
      task.assignees = userId;
      if (task.subtasks && task.subtasks.length > 0) {
        for (const subtask of task.subtasks) {
          subtask.assignees = userId;
        }
      }
      await task.save();
      const user = await User.findById(userId);
      await NotificationService.createNotification(
        project?._id,
        `Task ${task.name} is assigned to ${user.name}`
      );
      resolve({
        status: "OK",
        message: "Task status updated successfully",
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message,
      });
    }
  });
};
const removeAssigneeTask = async (taskId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const task = await Task.findOne({ _id: taskId });
      if (!task) {
        return resolve({
          status: "ERR",
          message: "Task not found",
        });
      }
      const project = await Project.findById(task.projectId);
      if (!project.members.includes(userId)) {
        return resolve({
          status: "ERR",
          message: "This member is not a member of this project",
        });
      }
      if (!task.assignees) {
        return resolve({
          status: "ERR",
          message: "This task already has no member",
        });
      }
      const currentDate = new Date();
      if (!(currentDate < task.dueDate)) {
        return resolve({
          status: "ERR",
          message: "Task out of date to remove assignee",
        });
      }
      task.assignees = null;
      if (task.subtasks && task.subtasks.length > 0) {
        for (const subtask of task.subtasks) {
          if (subtask.assignees && subtask.assignees === userId) {
            subtask.assignees = null;
          }
        }
      }
      await task.save();
      const user = await User.findById(userId);
      await NotificationService.createNotification(
        project?._id,
        `Task ${task.name} is unassigned to ${user.name}`
      );
      resolve({
        status: "OK",
        message: "Task status updated successfully",
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message,
      });
    }
  });
};
module.exports = {
  createTask,
  getAllTask,
  getDetailTask,
  updateStatusTask,
  updateStatusSubtask,
  addSubtask,
  deleteTasks,
  deleteTask,
  deleteSubtask,
  addAssigneeTask,
  removeAssigneeTask,
};
