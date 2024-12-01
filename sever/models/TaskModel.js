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
      _id: false,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: { type: String },
    },
    status: {
      type: String,
      enum: ["todo", "progress", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
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
        priority: {
          type: String,
          enum: ["low", "medium", "high"],
        },
        assignees: {
          _id: false,
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          name: { type: String },
        },
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
