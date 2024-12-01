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
const updateTask = async (id, data) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      projectId,
      dueDate,
      assignees,
      priority,
      status,
      description,
      subtasks,
    } = data;
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        return resolve({
          status: "ERR",
          message: "Project not found",
        });
      }
      if (new Date(project.endDate) < new Date(dueDate)) {
        return resolve({
          status: "ERR",
          message: `Due date of task "${name}" cannot be later than the project end date`,
        });
      }
      if (new Date(project.startDate) > new Date(dueDate)) {
        return resolve({
          status: "ERR",
          message: `Due date of task "${name}" cannot be elier than the project start date`,
        });
      }
      const checkTask = await Task.findOne({ name: name });
      if (checkTask !== null && checkTask.projectId === projectId) {
        return resolve({
          status: "ERR",
          message: "Task has already had",
        });
      }
      const assigneeIds = assignees.map((assignee) => assignee.userId);
      // Kiểm tra danh sách assignees có hợp lệ không
      const validAssignees = await User.find({ _id: { $in: assigneeIds } });
      if (validAssignees.length !== assigneeIds.length) {
        return resolve({
          status: "ERR",
          message: "One or more assignees are invalid",
        });
      }
      if (subtasks && subtasks.length > 0) {
        for (const subtask of subtasks) {
          const {
            name: subtaskName,
            assignees: subtaskAssignees,
            dueDate: subtaskDueDate,
          } = subtask;

          // Kiểm tra tên của subtask
          if (!subtaskName) {
            return resolve({
              status: "ERR",
              message: "Subtask must have a name",
            });
          }
          // Kiểm tra danh sách assignees của từng subtask
          if (subtaskAssignees && subtaskAssignees.length > 0) {
            const subtaskAssigneeIds = subtaskAssignees.map(
              (assignee) => assignee.userId
            );
            const validSubtaskAssignees = await User.find({
              _id: { $in: subtaskAssigneeIds },
            });
            if (validSubtaskAssignees.length !== subtaskAssigneeIds.length) {
              return resolve({
                status: "ERR",
                message: `One or more assignees in subtask "${subtaskName}" are invalid`,
              });
            }
          } else {
            return resolve({
              status: "ERR",
              message: `Subtask "${subtaskName}" must have at least one assignee`,
            });
          }
          // Kiểm tra dueDate của subtask
          const taskDueDate = dueDate;
          const projectStartDate = project.startDate;
          if (!subtaskDueDate) {
            return resolve({
              status: "ERR",
              message: `Subtask "${subtaskName}" must have a due date`,
            });
          }
          if (new Date(subtaskDueDate) < new Date(projectStartDate)) {
            return resolve({
              status: "ERR",
              message: `Due date of subtask "${subtaskName}" cannot be earlier than the project start date`,
            });
          }

          if (new Date(subtaskDueDate) > new Date(taskDueDate)) {
            return resolve({
              status: "ERR",
              message: `Due date of subtask "${subtaskName}" cannot be later than the task due date`,
            });
          }
        }
      }
      await Task.findByIdAndUpdate(id, data);
      await NotificationService.createNotification(
        projectId,
        `Project ${project?.name} is update a task`
      );
      resolve({
        status: "OK",
        message: "Task updated successfully",
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
      const currentDate = new Date();
      const canUpdateStatus =
        project.status === "progress" ||
        (project.status === "done" && currentDate < project.endDate);

      if (!canUpdateStatus) {
        return resolve({
          status: "ERR",
          message:
            "Cannot update task as project is not in progress or beyond allowed end date.",
        });
      }
      const subtask = task.subtasks.id(subtaskId);
      if (!subtask) {
        return resolve({
          status: "ERR",
          message: "Subtask not found",
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
      } else {
        (subtask.status = status), (task.status = "progress");
      }
      const tasks = await Task.find({
        projectId: task.projectId,
      });
      const allTasksCompleted = tasks.every((t) => t.status === "done");
      // Nếu tất cả tasks đã hoàn thành, cập nhật trạng thái của project thành "completed"
      if (allTasksCompleted) {
        await Project.findByIdAndUpdate(task.projectId, {
          status: "done",
        });
      }
      await NotificationService.createNotification(
        project?._id,
        `Project ${project?.name} update ${subtask.name} subtask status`
      );
      await task.save();
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
        if (task.assignees.toString() !== userId) {
          return resolve({
            status: "ERR",
            message: "User not assigned to this task",
          });
        }
      }
      const currentDate = new Date();
      const canUpdateStatus =
        project.status === "progress" ||
        (project.status === "done" && currentDate < project.endDate);

      if (!canUpdateStatus) {
        return resolve({
          status: "ERR",
          message:
            "Cannot update task as project is not in progress or beyond allowed end date.",
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
        } else {
          task.status = status;
          task.subtasks.forEach((subtask) => {
            subtask.status = status;
          });
        }
      } else {
        task.status = status;
      }
      const tasks = await Task.find({
        projectId: task.projectId,
      });
      const allTasksCompleted = tasks.every((t) => t.status === "done");
      // Nếu tất cả tasks đã hoàn thành, cập nhật trạng thái của project thành "completed"
      if (allTasksCompleted) {
        await Project.findByIdAndUpdate(task.projectId, {
          status: "done",
        });
      }
      await task.save();
      await NotificationService.createNotification(
        project?._id,
        `Project ${project?.name} update ${task.name} task status`
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
module.exports = {
  createTask,
  getAllTask,
  getDetailTask,
  updateTask,
  updateStatusTask,
  updateStatusSubtask,
  addSubtask,
  deleteTasks,
  deleteTask,
  deleteSubtask,
};
