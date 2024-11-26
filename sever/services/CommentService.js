const Comment = require("../models/CommentModel");
const User = require("../models/UserModel");
const getbytaskid = (taskId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Comment.find({ taskId: taskId });
      resolve({
        status: "OK",
        message: "Task created successfully",
        data: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const createComment = (author, content, taskId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem người dùng có tồn tại hay không
      const findUser = await User.findById(author);
      if (!findUser) {
        return resolve({
          status: "ERR",
          message: "Cannot find user",
        });
      }

      // Tạo và lưu bình luận mới
      const newComment = new Comment({
        author: {
          userId: author,
          userName: findUser.name,
        },
        content: content,
        taskId: taskId,
      });
      const savedComment = await newComment.save();

      resolve({
        status: "OK",
        message: "Comment created successfully",
        data: savedComment,
      });
    } catch (e) {
      // Trả về lỗi nếu có ngoại lệ xảy ra
      reject({
        status: "ERR",
        message: "An error occurred while creating the comment",
        error: e,
      });
    }
  });
};
const deleteComment = (commentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Comment.findByIdAndDelete(commentId);
      resolve({
        status: "OK",
        message: "delete successfully",
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: "An error occurred while creating the comment",
        error: e,
      });
    }
  });
};
module.exports = {
  getbytaskid,
  createComment,
  deleteComment,
};
