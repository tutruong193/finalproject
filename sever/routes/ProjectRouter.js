const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/ProjectController");

router.post("/create", ProjectController.createProject);
router.delete("/delete/:id", ProjectController.deleteProject);
router.put('/update/:id',ProjectController.updateProject);
router.get('/detail/:id', ProjectController.getDetailProject);
router.get("/getall", ProjectController.getAllProject);
module.exports = router;
