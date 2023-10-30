const router = require("express").Router();
const { authenticate, isAdmin } = require("../middleware/auth");

const {
  registration,
  activeUser,
  login,
  logOutUser,
  updateAccessToken,
  getUserInfo,
  socialAuth,
  updateUserInfo,
  updatePassword,
  updateprofilePic,
} = require("../controller/userController");

//User CRUD
router.post("/registration", registration);
router.post("/activate", activeUser);
router.post("/login", login);
router.get("/logout", authenticate, logOutUser);
router.get("/update/accesstoken", authenticate, updateAccessToken);
router.get("/getinfo", authenticate, getUserInfo);
router.post("/social-auth", socialAuth);
router.post("/update/userinfo", authenticate, updateUserInfo);
router.post("/update/password", authenticate, updatePassword);
router.post("/update/avatar", authenticate, updateprofilePic);

module.exports = router;
