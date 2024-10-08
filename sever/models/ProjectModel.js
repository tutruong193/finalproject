const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    managerID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: { type: String, required: true },
        _id: false,
      },
    ],
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
