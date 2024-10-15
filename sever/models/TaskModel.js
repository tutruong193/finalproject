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
    assignees: [
      {
        _id: false,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: { type: String, required: true },
        status: {
          type: String,
          enum: ["progress", "completed"],
          required: true,
          default: "progress",
        },
      },
    ],
    status: {
      type: String,
      enum: ["progress", "completed"],
      default: "progress",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
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
          enum: ["progress", "completed"],
          default: "progress",
        },
        dueDate: {
          type: Date,
          required: true,
        },
        assignees: [
          {
            _id: false,
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            name: { type: String, required: true },
            status: {
              type: String,
              enum: ["progress", "completed"],
              required: true,
              default: "progress",
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
