const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authAdminMiddleWare } = require("../middleware/authMiddleware");

router.post("/login", UserController.loginUser);
router.post("/logout", UserController.logoutUser);
router.get("/getall", UserController.getAllUser);
router.post("/create", UserController.createUser);
router.delete("/delete/:id", UserController.deleteUser);
router.delete("/delete-many", UserController.deleteManyUser);
router.get("/detail/:id", UserController.detailUser);
router.put("/update/:id", UserController.updateUser);
//reset password
router.post("/vertify", UserController.vertifyUser);
router.post("/send-vertify-code/:id", UserController.sendVertifyCode);
router.post("/verify-code/:id", UserController.vertifyCode);
router.put("/changepassword/:id", UserController.changePassword);
module.exports = router;
