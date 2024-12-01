const UserRouter = require("./UserRouter");
const ProjectRouter = require("./ProjectRouter");
const TaskRouter = require("./TaskRouter");
const CommentRouter = require("./CommentRouter");
const NotificationRouter = require("./NotificationRouter");
const routes = (app) => {
  app.use("/api/notification", NotificationRouter);
  app.use("/api/user", UserRouter);
  app.use("/api/project", ProjectRouter);
  app.use("/api/comment", CommentRouter);
  app.use("/api/task", TaskRouter);
};
module.exports = routes;
