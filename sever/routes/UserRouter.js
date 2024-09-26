const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
router.get("/getall",UserController.getAllUser)
router.post("/create", UserController.createUser);
router.delete("/delete/:id", UserController.deleteUser);
router.delete("/delete-many", UserController.deleteManyUser);
router.get('/detail/:id',  UserController.detailUser);
router.put('/update/:id', UserController.updateUser);
module.exports = router;
