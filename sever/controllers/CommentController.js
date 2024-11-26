const CommentService = require("../services/CommentService");
const moment = require("moment-timezone");
const getbytaskid = async (req, res) => {
  try {
    const taskid = req.params.id;
    if (!taskid) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
        data: req.body,
      });
    }
    const response = await CommentService.getbytaskid(taskid);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "ERR",
      message: "Something went wrong",
    });
  }
};
const createComment = async (req, res) => {
  try {
    const { author, content, taskId } = req.body;
    if (!author || !content || !taskId) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing required fields: author, content, or taskId",
      });
    }
    const response = await CommentService.createComment(
      author,
      content,
      taskId
    );
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteComment = async (req, res) => {
  try {
    const commentId  = req.params.id;
    if (!commentId) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing commentId",
      });
    }
    const response = await CommentService.deleteComment(commentId);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  getbytaskid,
  createComment,
  deleteComment,
};
