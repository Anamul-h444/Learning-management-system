const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = (req, res, next) => {
  // Get the access token from the request cookies
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the access token
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token expired or invalid" });
      }

      // Check if the user exists in the database
      const foundUser = await User.findById(decoded._id);

      if (!foundUser) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach the user object to the request for use in protected routes
      req.user = foundUser;

      next();
    }
  );
};

//for admin
const isAdmin = (req, res, next) => {
  // Check if the user is an admin
  if (req.user && req.user.role === "admin") {
    // User is an admin, proceed to the next middleware or route handler
    next();
  } else {
    // User is not an admin, return a 403 Forbidden response
    res
      .status(403)
      .json({ message: "Permission denied. You must be an admin." });
  }
};

module.exports = {
  authenticate,
  isAdmin,
};
