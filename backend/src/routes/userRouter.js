const router = require("express").Router();
const { authenticate, isAdmin } = require("../middleware/auth");

const {
  registration,
  activeUser,
  login,
  logOutUser,
  updateAccessToken,
} = require("../controller/userController");
//User CRUD
router.post("/registration", registration);
router.post("/activate", activeUser);
router.post("/login", login);
router.get("/logout", authenticate, logOutUser);
router.get("/refreshtoken", authenticate, updateAccessToken);
// router.post("/update/:id", [userAuth], updateUser);
// router.delete("/delete/:id", [userAuth, adminAuth], deleteUser);
// router.get("/get/details", [userAuth], getUserDetails);
// router.get("/get", [userAuth], getUsers);

// //Reset Password
// router.get("/verifyEmail/:email", VerifyEmail);
// router.get("/verifyOtp/:email/:otp", VerifyOTP);
// router.post("/resetPassword", ResetPassword);

module.exports = router;
