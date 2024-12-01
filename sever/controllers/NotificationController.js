const NotificationService = require("../services/NotificationService");


const getNotification = async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!projectId) {
      return res.status(200).json({
        status: "ERR",
        message: "The projectId is required",
      });
    }
    const response = await NotificationService.getNotification(projectId);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  getNotification
};
