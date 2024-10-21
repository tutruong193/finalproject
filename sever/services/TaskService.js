const Task = require("../models/TaskModel");
const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");
const moment = require("moment-timezone");
const createTask = (data) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      projectId,
      dueDate,
      assignees,
      priority,
      status,
      description,
    } = data;
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
const deleteSubtask = async (taskId, subtaskId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm task dựa trên taskId
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
      task.subtasks.splice(subtaskIndex, 1);
      await task.save();

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
const updateStatusSubtask = async (taskId, subtaskId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return resolve({
          status: "ERR",
          message: "Task not found",
        });
      }

      // Cập nhật trạng thái của subtask nếu subtaskId được truyền vào
      const subtask = task.subtasks.id(subtaskId);
      if (!subtask) {
        return resolve({
          status: "ERR",
          message: "Subtask not found",
        });
      }

      // Nếu trạng thái của subtask là "completed", cập nhật lại thành "in progress"
      if (subtask.status === "completed") {
        subtask.status = "progress";

        // Cập nhật trạng thái của tất cả các assignees trong subtask thành "in progress"
        subtask.assignees.forEach((assignee) => {
          if (assignee.status === "completed") {
            assignee.status = "progress";
          }
        });

        // Cập nhật trạng thái task thành "in progress" nếu subtask đã thay đổi
        task.status = "progress";
        const userInAsignee = task.assignees.find(
          (assignee) => assignee.userId.toString() === userId
        );
        console.log(userInAsignee);
        userInAsignee.status = "progress";
      } else {
        // Tìm assignee theo userId
        const assignee = subtask.assignees.find(
          (a) => a.userId.toString() === userId
        );
        if (!assignee) {
          return resolve({
            status: "ERR",
            message: "User not assigned to this subtask",
          });
        }

        // Cập nhật trạng thái assignee thành "completed"
        assignee.status = "completed";

        // Kiểm tra xem người dùng đã hoàn thành tất cả các subtasks của họ chưa
        const userSubtasks = task.subtasks.filter((st) =>
          st.assignees.some((a) => a.userId.toString() === userId)
        );
        const userCompleted = userSubtasks.every((st) =>
          st.assignees.some(
            (a) => a.userId.toString() === userId && a.status === "completed"
          )
        );

        // Nếu người dùng đã hoàn thành tất cả subtasks của họ, cập nhật trạng thái của họ trong assignees của task
        if (userCompleted) {
          const taskAssignee = task.assignees.find(
            (a) => a.userId.toString() === userId
          );
          if (taskAssignee) {
            taskAssignee.status = "completed";
          }
        }

        // Kiểm tra xem tất cả assignees của subtask đã hoàn thành chưa
        const allCompleted = subtask.assignees.every(
          (a) => a.status === "completed"
        );
        if (allCompleted) {
          subtask.status = "completed";
        }

        // Kiểm tra xem tất cả subtasks của task đã hoàn thành chưa
        const allSubtasksCompleted = task.subtasks.every(
          (st) => st.status === "completed"
        );
        if (allSubtasksCompleted) {
          task.status = "completed";
        }

        // Kiểm tra xem tất cả tasks trong project đã hoàn thành chưa
        const allTasksOfProject = await Task.find({
          projectId: task.projectId,
        });
        const allTasksCompleted = allTasksOfProject.every(
          (t) => t.status === "completed"
        );

        // Nếu tất cả tasks đã hoàn thành, cập nhật trạng thái của project thành "completed"
        if (allTasksCompleted) {
          await Project.findByIdAndUpdate(task.projectId, {
            status: "completed",
          });
        }
      }

      await task.save();
      resolve({
        status: "OK",
        message: subtaskId
          ? "Subtask status updated successfully"
          : "Task status updated successfully",
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

const updateStatusTask = async (taskId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return resolve({
          status: "ERR",
          message: "Task not found",
        });
      }
      //cập nhật trạng thái của assignee trong task
      const assignee = task.assignees.find(
        (a) => a.userId.toString() === userId
      );
      if (!assignee) {
        return resolve({
          status: "ERR",
          message: "User not assigned to this task",
        });
      }
      // Nếu trạng thái của assignee đã là "completed", cập nhật lại thành "progress"
      if (assignee.status === "completed") {
        assignee.status = "progress";
        task.status = "progress";
        if (task.subtasks && task.subtasks.length > 0) {
          const findSubtask = task.subtasks.find(
            (a) => a.userId.toString() === userId
          );
          console.log(findSubtask);
        }

        await task.save();
        return resolve({
          status: "OK",
          message:
            "Task and related subtasks/assignees status updated to 'progress'",
        });
      }
      const allSubtasksCompleted = task.subtasks.every(
        (subtask) => subtask.status === "completed"
      );
      if (task.subtasks.length > 0) {
        if (allSubtasksCompleted) {
          assignee.status = "completed";
        } else {
          return resolve({
            status: "ERR",
            message: "Subtask doesn't complete",
          });
        }
      } else {
        assignee.status = "completed";
      }
      // Kiểm tra xem tất cả assignees của task đã hoàn thành chưa
      const allTaskAssigneesCompleted = task.assignees.every(
        (a) => a.status === "completed"
      );
      if (allTaskAssigneesCompleted) {
        task.status = "completed";
      }
      // Kiểm tra xem tất cả tasks trong project đã hoàn thành chưa
      const tasks = await Task.find({
        projectId: task.projectId,
      });
      const allTasksCompleted = tasks.every((t) => t.status === "completed");
      // Nếu tất cả tasks đã hoàn thành, cập nhật trạng thái của project thành completed
      if (allTasksCompleted) {
        await Project.findByIdAndUpdate(task.projectId, {
          status: "completed",
        });
      }
      await task.save();
      resolve({
        status: "OK",
        message: "Task status updated successfully",
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
  updateStatusTask,
  updateStatusSubtask,
  addSubtask,
  deleteTask,
  deleteSubtask,
};
