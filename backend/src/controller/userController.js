const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../mailer/sendEmail");
const path = require("path");
const ejs = require("ejs");
require("dotenv").config();
const {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} = require("../utility/jwt");

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

//login user

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).send("Invalid email or password");
    }
    sendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//logout user
module.exports.logOutUser = (req, res) => {
  try {
    res.clearCookie("access_token"); // Clear the access_token cookie
    res.clearCookie("refresh_token"); // Clear the refresh_token cookie
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Update access token
module.exports.updateAccessToken = (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }
    const user = User.findById(decoded._id);
    const accessToken = jwt.sign(
      { _id: this._id },
      process.env.ACCESS_TOKEN_SECRET || "",
      { expiresIn: "5m" }
    );
    const refreshToken = jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET || "",
      { expiresIn: "7d" }
    );

    //set cookie
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
