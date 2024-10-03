const UserRouter = require("./UserRouter");
const ProjectRouter = require("./ProjectRouter");
const TaskRouter = require("./TaskRouter");
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/project", ProjectRouter);
  app.use("/api/task", TaskRouter);
};
module.exports = routes;
