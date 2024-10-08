const ProjectService = require("../services/ProjectService");
const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      managerID,
      members,
      startDate,
      endDate,
      status,
    } = req.body;
    if (!name || !startDate || !endDate) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    if (!managerID) {
      return res.status(200).json({
        status: "ERR",
        message: "The managerID is required",
      });
    }
    if (name.length < 3) {
      return res.status(200).json({
        status: "ERR",
        message: "Project name must be at least 3 characters long",
      });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(200).json({
        status: "ERR",
        message: "Invalid date format",
      });
    }
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(200).json({
        status: "ERR",
        message: "Invalid date format",
      });
    }
    if (start > end) {
      return res.status(200).json({
        status: "ERR",
        message: "Start date cannot be later than end date",
      });
    }
    if (start.getTime() === end.getTime()) {
      return res.status(200).json({
        status: "ERR",
        message: "Start date and end date cannot be the same",
      });
    }
    if (start < now || end < now) {
      return res.status(200).json({
        status: "ERR",
        message: "Start date and end date must be after the current date",
      });
    }
    const response = await ProjectService.createProject(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllProject = async (req, res) => {
  try {
    const response = await ProjectService.getAllProject();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteProject = async (req, res) => {
  try {
    const ProjectId = req.params.id;
    if (!ProjectId) {
      return res.status(400).json({
        status: "ERR",
        message: "ProjectID is required",
      });
    }
    const response = await ProjectService.deleteProject(ProjectId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getDetailProject = async (req, res) => {
  try {
    const ProjectId = req.params.id;
    if (!ProjectId) {
      return res.status(400).json({
        status: "ERR",
        message: "ProjectID is required",
      });
    }
    const response = await ProjectService.getDetailProject(ProjectId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const updateProject = async (req, res) => {
  try {
    const { name, description, members, startDate, endDate, status } = req.body;
    const projectId = req.params.id;
    if (!name || !startDate || !endDate) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    if (name.length < 3) {
      return res.status(200).json({
        status: "ERR",
        message: "Project name must be at least 3 characters long",
      });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(200).json({
        status: "ERR",
        message: "Invalid date format",
      });
    }
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(200).json({
        status: "ERR",
        message: "Invalid date format",
      });
    }
    if (start > end) {
      return res.status(200).json({
        status: "ERR",
        message: "Start date cannot be later than end date",
      });
    }
    if (start.getTime() === end.getTime()) {
      return res.status(200).json({
        status: "ERR",
        message: "Start date and end date cannot be the same",
      });
    }
    if (start < now || end < now) {
      return res.status(200).json({
        status: "ERR",
        message: "Start date and end date must be after the current date",
      });
    }
    const response = await ProjectService.updateProject(projectId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createProject,
  getAllProject,
  deleteProject,
  getDetailProject,
  updateProject,
};
