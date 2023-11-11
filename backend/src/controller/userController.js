const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../mailer/sendEmail");
const path = require("path");
const ejs = require("ejs");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
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
    if (user)
      return res.status(400).json({ message: "User already registered" });
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
      return res.status(400).json({ message: "Invalid activation code" });
    }
    const { name, email, password } = check.user;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email already exist" });
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

    req.user = user;

    //set cookie
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// getUserInfo
module.exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId); // Pass the userId directly
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, user, message: "User retrieved successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Social auth
module.exports.socialAuth = async (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const newUser = await User.create({ email, name, avatar });
      sendToken(newUser, 200, res);
    } else {
      sendToken(user, 200, res);
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update user info
module.exports.updateUserInfo = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user?._id;

    // Find the user by ID
    let user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update only the 'name' field
    user.name = name;

    // Save the updated user
    await user.save();

    res.status(200).json({
      success: true,
      user,
      message: "User information updated successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// update password
module.exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const userId = req.user?._id;

    // Find the user by ID
    let user = await User.findById(userId).select("+password");

    //Checking if user is registration by social auth
    if (user?.password === undefined) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const isPasswordMatch = await user?.comparePassword(oldPassword);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid old password" });
    }
    user.password = newPassword;

    await user.save();
    res
      .status(201)
      .json({ success: true, user, message: "Password update successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update profile picture
module.exports.updateprofilePic = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?._id;
    let user = await User.findById(userId);

    if (avatar && user) {
      if (user?.avatar?.public_id) {
        // Delete the previous avatar from Cloudinary
        await cloudinary.uploader.destroy(user?.avatar?.public_id);
      }

      // Upload the new avatar to Cloudinary
      const result = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
      });

      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    await user.save();
    res
      .status(201)
      .json({ success: true, user, message: "Avatar update successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//get all users --only admin is allowed
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//update user role
module.exports.updateUserRole = async (req, res) => {
  try {
    const { id, role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, user, message: "User role update successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//delete user --only admin is allowed
module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    await user.deleteOne({ _id: id });

    // Send success response
    res.status(200).json({ success: true, message: "User delete successful" });
  } catch (error) {
    // Handle the error and send an error response
    res.status(400).json({ success: false, message: error.message });
  }
};
