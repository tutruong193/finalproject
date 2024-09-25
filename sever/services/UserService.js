const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const createUser = (data) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, role } = data;
    try {
      const checkEmail = await User.findOne({ email: email });
      const checkName = await User.findOne({ name: name });
      if (checkEmail !== null) {
        resolve({
          status: "ERR",
          message: "Email already exists",
        });
      } else if (checkName !== null) {
        resolve({
          status: "ERR",
          message: "This guy had an account",
        });
      } else {
        const createdUser = await User.create({
          name,
          email,
          password: bcrypt.hashSync(password, 10),
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
        "name email role createdAt updatedAt"
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
module.exports = {
  createUser,
  getAllUser,
};
