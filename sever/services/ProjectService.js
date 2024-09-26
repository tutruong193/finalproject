const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");

const createProject = (data) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      description,
      managerID,
      membersID,
      startDate,
      endDate,
      status,
    } = data;

    try {
      // Kiểm tra tên dự án đã tồn tại
      const checkName = await Project.findOne({ name: name });
      if (checkName !== null) {
        return resolve({
          status: "ERR",
          message: "The project name is already in use",
        });
      }

      // Kiểm tra xem managerID có tồn tại không
      const checkUser = await User.findOne({ _id: managerID });
      if (!checkUser) {
        return resolve({
          status: "ERR",
          message: "This manager account does not exist",
        });
      }

      // Tạo mới dự án nếu mọi thứ đều hợp lệ
      const createdProject = await Project.create({
        name,
        description,
        managerID,
        membersID,
        startDate,
        endDate,
        status,
      });

      // Nếu tạo thành công, trả về kết quả
      if (createdProject) {
        return resolve({
          status: "OK",
          message: "Project created successfully",
          data: createdProject,
        });
      }
    } catch (e) {
      // Trả về lỗi nếu có ngoại lệ xảy ra
      return reject({
        status: "ERR",
        message: "An error occurred during project creation",
        error: e,
      });
    }
  });
};
const getAllProject = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Project.find()
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
  createProject,
  getAllProject
};
