const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/ProjectController");
const {
  authManagerMiddleWare,
} = require("../middleware/authMiddleware");
router.post("/create", authManagerMiddleWare, ProjectController.createProject);
router.delete(
  "/delete/:id",
  authManagerMiddleWare,
  ProjectController.deleteProject
);
router.put(
  "/update/:id",
  authManagerMiddleWare,
  ProjectController.updateProject
);
router.get("/detail/:id", ProjectController.getDetailProject);
router.get("/getall", ProjectController.getAllProject);
router.put(
  "/addmember/:id",
  authManagerMiddleWare,
  ProjectController.addMemberToProject
);
router.put(
  "/deletemember/:id",
  authManagerMiddleWare,
  ProjectController.deleteMemberFromProject
);
module.exports = router;
