const Notification = require("../models/NotificationModel");
const createNotification = async (projectId, usertarget, content) => {
  try {
    // const notificationUsers = usertarget.map((user) => ({
    //   userId: user.userId,
    // }));
    const newNotification = new Notification({
      projectId,
      userTarget: usertarget,
      content,
    });
    await newNotification.save();
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
const getNotification = async (projectId) => {
  try {
    const notification = await Notification.find({ projectId: projectId });
    return {
      status: "OK",
      message: "Notification created successfully",
      data: notification,
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
  getNotification,
};
