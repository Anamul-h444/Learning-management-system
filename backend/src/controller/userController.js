const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../mailer/sendEmail");
const path = require("path");
const ejs = require("ejs");
require("dotenv").config();

module.exports.registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = {};
    // Check email
    user = await User.findOne({ email: email });
    if (user) return res.status(400).send("User already registered");
    user = { name, email, password };

    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const data = { user: { name: user.name }, activationCode };

    // Get the path to the email template file
    const templatePath = path.join(__dirname, "../mailer/activation-mail.ejs");

    // Render the email template with ejs
    const html = await ejs.renderFile(templatePath, data);

    try {
      await sendEmail(user.email, "Activate your account", html);
      res.status(201).json({
        success: true,
        message: "Please check your email to activate your account",
        activationToken: activationToken.token,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const createActivationToken = (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign({ user, activationCode }, process.env.JWT_SECRET_KEY, {
    expiresIn: "5m",
  });
  return { token, activationCode };
};

//Activate user
module.exports.activeUser = async (req, res) => {
  try {
    const { activationToken, activationCode } = req.body;
    const check = jwt.verify(activationToken, process.env.JWT_SECRET_KEY);

    if (check.activationCode !== activationCode) {
      return res.status(400).send("Invalid activation code");
    }
    const { name, email, password } = check.user;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).send("Email already exist");
    }
    const user = await User.create({ name, email, password });
    res
      .status(201)
      .json({ success: true, message: "User activate successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
