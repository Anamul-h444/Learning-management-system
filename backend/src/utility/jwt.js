require("dotenv").config();
const jwt = require("jsonwebtoken");

// Parse environment variables with fallback values
const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRE || 300;
const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRE || 1200;

// Options for cookies
const accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

const refreshTokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

const sendToken = (user, statusCode, res) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  //set cookie
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({ success: true, user, accessToken });
};

module.exports = { sendToken, accessTokenOptions, refreshTokenOptions };

// require("dotenv").config();
// const jwt = require("jsonwebtoken");

// const sendToken = (user, statusCode, res) => {
//   const accessToken = user.signAccessToken();
//   const refreshToken = user.signRefreshToken();

//   // Parse environment variables with fallback values
//   const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRE || 300;
//   const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRE || 1200;

//   // Options for cookies
//   const accessTokenOptions = {
//     expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
//     maxAge: accessTokenExpire * 60 * 60 * 1000,
//     httpOnly: true,
//     sameSite: "lax",
//   };

//   const refreshTokenOptions = {
//     expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
//     maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//     sameSite: "lax",
//   };

//   // Only set secure to true in production
//   if (process.env.NODE_ENV === "production") {
//     accessTokenOptions.secure = true;
//   }

//   res.cookie("access_token", accessToken, accessTokenOptions);
//   res.cookie("refresh_token", refreshToken, refreshTokenOptions);

//   res.status(statusCode).json({ success: true, user, accessToken });
// };

// module.exports = sendToken;
