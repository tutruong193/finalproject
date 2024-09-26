const UserRouter = require("./UserRouter");
const ProjectRouter = require("./ProjectRouter");
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/project", ProjectRouter);
};
module.exports = routes;
