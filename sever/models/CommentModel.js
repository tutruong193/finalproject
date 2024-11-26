const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true, // Nội dung bình luận là bắt buộc
      trim: true, // Loại bỏ khoảng trắng thừa
    },
    author: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // Liên kết tới bảng Task
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", CommentSchema);
