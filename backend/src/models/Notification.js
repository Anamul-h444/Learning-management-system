const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, required: true, default: "unread" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
