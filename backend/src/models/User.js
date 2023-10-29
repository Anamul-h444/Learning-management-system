const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, "Please enter your name"] },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value) {
          return emailRegex.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Please must be at least 6 characters"],
      select: false,
    },
    avater: {
      public_id: String,
      url: String,
    },
    role: { type: String, default: "user" },
    isVerified: { type: Boolean, default: false },
    courses: [{ courseId: String }],
  },
  { timestamps: true }
);

//hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//compare password
userSchema.methods.comparePasswrod = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
