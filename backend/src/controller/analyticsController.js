const generateLast12MonthData = require("../utility/analyticsGenerator");
const User = require("../models/User");
const Courses = require("../models/Courses");
const Order = require("../models/Order");

//get user analytics --only admin is allowed
module.exports.getUserAnalytics = async (req, res) => {
  try {
    const user = await generateLast12MonthData(User);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//get course analytics --only admin is allowed
module.exports.getCourseAnalytics = async (req, res) => {
  try {
    const course = await generateLast12MonthData(Courses);
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//get order analytics --only admin is allowed
module.exports.getOrderAnalytics = async (req, res) => {
  try {
    const order = await generateLast12MonthData(Order);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
