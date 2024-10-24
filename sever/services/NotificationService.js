const Notification = require("../models/NotificationModel");

// Service tạo thông báo
const createNotification = async (
  projectId,
  type,
  messsage,
  userId,
  taskId
) => {
  try {
    // Tạo thông báo mới
    const newNotification = new Notification({
      projectId,
      notifications: [
        {
          type: type,
          message: messsage,
          recipient: userId,
          taskId: taskId || null,
          read: false,
        },
      ], // Mảng các thông báo
    });

    // Lưu thông báo vào DB
    const savedNotification = await newNotification.save();
    return {
      status: "OK",
      message: "Notification created successfully",
    };
  } catch (error) {
    console.error("Error creating notification:", error);
    return {
      status: "ERROR",
      message: "Error creating notification",
    };
  }
};

module.exports = {
  createNotification,
};
