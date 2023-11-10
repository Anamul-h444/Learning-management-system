const Notification = require("../models/Notification");
const corn = require("node-cron");

//get all notification -- only admin
module.exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.find().sort({ createdAt: -1 });
    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//update notification status -- only admin
module.exports.updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      res.status(400).json({ message: "Notification not found" });
    } else {
      notification.status
        ? (notification.status = "read")
        : notification.status;
    }
    await notification.save();

    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(201).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//delete notification --only admin
corn.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await Notification.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });
});
