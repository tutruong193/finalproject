const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
router.get("/getall",UserController.getAllUser)
router.post("/create", UserController.createUser);
module.exports = router;
