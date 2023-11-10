const User = require("../models/User");
const Courses = require("../models/Courses");
const Notification = require("../models/Notification");
const Order = require("../models/Order");
const ejs = require("ejs");
const sendEmail = require("../mailer/sendEmail");
const path = require("path");

module.exports.createOrder = async (req, res) => {
  try {
    const { courseId, payment_info } = req.body;

    // Validate user authentication
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(req.user._id);

    // Check if the course is already purchased
    const courseExistInUser = user.courses.find(
      (course) => course.courseId === courseId
    );

    if (courseExistInUser) {
      return res
        .status(400)
        .json({ message: "You have already purchased this course" });
    }

    const course = await Courses.findById(courseId);

    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }

    const data = {
      courseId: course._id,
      userId: user._id,
    };

    const order = await Order.create(data);

    const orderData = {
      _id: course._id.toString().slice(0, 6),
      name: course.name,
      price: course.price,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    // Get the path to the email template file
    const templatePath = path.join(
      __dirname,
      "../mailer/order-confirmation.ejs"
    );

    // Render the email template with ejs
    const html = await ejs.renderFile(templatePath, { orderData: orderData });
    try {
      await sendEmail(user.email, "Order confirmation", html);
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Email sending failed" });
    }

    // Update user courses
    user.courses.push({ courseId: course._id });
    await user.save();

    // Increment the 'purchased' count by 1
    course.purchased = (course.purchased || 0) + 1;
    await course.save();

    // Notify admin about the new order
    await Notification.create({
      user: user?._id,
      title: "New Order",
      message: `You have a new order from ${course.name}`,
    });

    res.status(201).json({ success: true, order: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get all courses --only admin allowed
module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
