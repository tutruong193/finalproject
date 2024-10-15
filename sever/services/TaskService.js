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
      if (checkTask !== null && checkTask.projectId == projectId) {
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
      resolve({
        status: "OK",
        message: "Task updated successfully",
      });
    } catch (error) {
      throw error;
    }
  });
};
const updateStatus = async (taskId, subtaskId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return resolve({
          status: "ERR",
          message: "Task not found",
        });
      }

      if (subtaskId) {
        // Cập nhật trạng thái của subtask nếu subtaskId được truyền vào
        const subtask = task.subtasks.id(subtaskId);
        if (!subtask) {
          return resolve({
            status: "ERR",
            message: "Subtask not found",
          });
        }
        subtask.status = "completed";
      } else {
        // Nếu không có subtaskId, cập nhật trạng thái của task chính
        if (task.subtasks.length > 0) {
          // Kiểm tra xem tất cả các subtasks đã hoàn thành chưa
          const incompleteSubtasks = task.subtasks.filter(
            (subtask) => subtask.status !== "completed"
          );
          if (incompleteSubtasks.length > 0) {
            return resolve({
              status: "ERR",
              message: "Cannot complete task until all subtasks are completed",
            });
          }
        }
        task.status = "completed";
      }

      await task.save();

      resolve({
        status: "OK",
        message: subtaskId
          ? "Subtask status updated successfully"
          : "Task status updated successfully",
      });
    } catch (error) {
      throw error;
    }
  });
};
const addSubtask = async (id, data) => {
  return new Promise(async (resolve, reject) => {
    const { name, dueDate, assignees } = data;

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
      const validAssignees = assignees.every((assignee) =>
        task.assignees.some(
          (taskAssignee) => taskAssignee.userId.toString() === assignee.userId
        )
      );
      if (!validAssignees) {
        return resolve({
          status: "ERR",
          message: "One or more assignees do not exist in the task's assignees",
        });
      }
      if (task.subtasks.some((subtask) => subtask.name === name)) {
        return resolve({
          status: "ERR",
          message: `A subtask with the name "${name}" already exists in this task`,
        });
      }
      task.subtasks.push({ name, dueDate, assignees });
      await task.save();
      resolve({
        status: "OK",
        message: "Subtask added successfully",
      });
    } catch (error) {
      throw error;
    }
  });
};
const deleteTask = async (taskId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const task = await Task.findByIdAndDelete(taskId);
      if (!task) {
        return resolve({
          status: "ERR",
          message: "Task not found",
        });
      }
      resolve({
        status: "OK",
        message: "Task Delete successfully",
      });
    } catch (error) {
      throw error;
    }
  });
};
module.exports = {
  createTask,
  getAllTask,
  getDetailTask,
  updateTask,
  updateStatus,
  addSubtask,
  deleteTask,
};
