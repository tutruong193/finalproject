const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/ProjectController");

router.post("/create", ProjectController.createProject);
router.get("/getall", ProjectController.getAllProject);
module.exports = router;
