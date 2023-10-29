const router = require("express").Router();

const { registration, activeUser } = require("../controller/userController");
//User CRUD
router.post("/registration", registration);
router.post("/activate", activeUser);
// router.post("/login", loginUser);
// router.post("/login", login);
// router.post("/update/:id", [userAuth], updateUser);
// router.delete("/delete/:id", [userAuth, adminAuth], deleteUser);
// router.get("/get/details", [userAuth], getUserDetails);
// router.get("/get", [userAuth], getUsers);

// //Reset Password
// router.get("/verifyEmail/:email", VerifyEmail);
// router.get("/verifyOtp/:email/:otp", VerifyOTP);
// router.post("/resetPassword", ResetPassword);

module.exports = router;
