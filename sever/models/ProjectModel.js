const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    managerID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "progress", "done", "incompleted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
