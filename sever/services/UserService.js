const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generalAccessToken } = require("./JWTService");
const EmailService = require("./EmailService");
const createUser = (data) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, phone, role } = data;
    try {
      const checkEmail = await User.findOne({ email: email });
      if (checkEmail !== null) {
        resolve({
          status: "ERR",
          message: "Email already exists",
        });
      } else {
        const createdUser = await User.create({
          name,
          email,
          phone,
          password: bcrypt.hashSync("123", 10),
          role,
        });
        if (createdUser) {
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: createdUser,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getAllUser = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await User.find().select(
        "name email phone role avatar createdAt updatedAt"
      );
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: data,
      });
    } catch (error) {
      throw error;
    }
  });
};
const deleteUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById(id);
      if (checkUser == null) {
        resolve({
          status: "ERR",
          message: "Cannot find user",
        });
      } else {
        await User.findByIdAndDelete(id);
        resolve({
          status: "OK",
          message: "SUCCESS",
        });
      }
    } catch (error) {
      throw error;
    }
  });
};
const deleteManyUser = async (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ids || ids.length === 0) {
        resolve({
          status: "ERR",
          message: "No users selected for deletion",
        });
      } else {
        await User.deleteMany({
          _id: { $in: ids }, // Điều kiện xóa: _id trong danh sách ids
        });
        resolve({
          status: "OK",
          message: "Users deleted successfully",
        });
      }
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message || "Error occurred while deleting users",
      });
    }
  });
};
const updateUser = async (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updateUser = await User.findByIdAndUpdate(id, data);
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updateUser,
      });
    } catch (error) {
      throw error;
    }
  });
};
const detailUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      });
      if (user === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCESS",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const loginUser = (data) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = data;
    try {
      const checkUser = await User.findOne({ email: email });
      if (checkUser == null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        checkUser.password
      );
      if (!isPasswordValid) {
        return resolve({
          status: "ERR",
          message: "The password or username is not correct",
        });
      }
      const access_token = await generalAccessToken({
        id: checkUser._id,
        role: checkUser.role,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        access_token: access_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const sendVertifyCode = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);
      if (user === null) {
        resolve({
          status: "ERR",
          message: "cannot fint user",
        });
      }
      const activationCode = Math.floor(100000 + Math.random() * 900000);
      user.vertifycode = activationCode;
      await user.save();
      const emailResult = await EmailService.sendActivationCodeEmail(
        "tutagch210167@fpt.edu.vn",
        activationCode
      );
      if (emailResult.status === "OK") {
        resolve({
          status: "OK",
          message: "SUCCESS",
        });
      } else {
        resolve({
          status: "ERR",
          message: "Faild to send activation code",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const vertifyUser = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ email: email });
      if (checkUser == null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: checkUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const vertifyCode = (id, code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById(id);
      if (checkUser == null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      if (code == checkUser.vertifycode) {
        checkUser.vertifycode = "";
        await checkUser.save();
        resolve({
          status: "OK",
          message: "SUCCESS",
        });
      } else {
        resolve({
          status: "ERR",
          message: "Code is not correct",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const changePassword = (id, password, request) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById(id);
      if (checkUser == null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      if (request === "forget") {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        checkUser.password = hashedPassword;
        await checkUser.save();
        resolve({
          status: "OK",
          message: "Password updated successfully",
        });
      } else {
        const isPasswordValid = await bcrypt.compare(
          request,
          checkUser.password
        );
        if (!isPasswordValid) {
          return resolve({
            status: "ERR",
            message: "The password is not correct",
          });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        checkUser.password = hashedPassword;
        await checkUser.save();
        resolve({
          status: "OK",
          message: "Password updated successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createUser,
  getAllUser,
  deleteUser,
  deleteManyUser,
  updateUser,
  detailUser,
  loginUser,
  vertifyUser,
  sendVertifyCode,
  vertifyCode,
  changePassword,
};
