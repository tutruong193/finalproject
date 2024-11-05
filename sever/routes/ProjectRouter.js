const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/ProjectController");

router.post("/create", ProjectController.createProject);
router.delete("/delete/:id", ProjectController.deleteProject);
router.put('/update/:id',ProjectController.updateProject);
router.get('/detail/:id', ProjectController.getDetailProject);
router.get("/getall", ProjectController.getAllProject);
router.put("/addmember/:id", ProjectController.addMemberToProject);
router.put("/deletemember/:id", ProjectController.deleteMemberFromProject);
module.exports = router;
