const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignees: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["todo", "progress", "done"],
      default: "todo",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    subtasks: [
      {
        name: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["todo", "progress", "done"],
          default: "todo",
        },
        dueDate: {
          type: Date,
          required: true,
        },
        assignees: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
