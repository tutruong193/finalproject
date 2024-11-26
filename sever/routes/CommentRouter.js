const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");

router.get("/getbytaskid/:id", CommentController.getbytaskid);
router.post("/create", CommentController.createComment);
router.delete("/delete/:id", CommentController.deleteComment);
module.exports = router;
