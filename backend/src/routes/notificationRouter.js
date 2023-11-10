const router = require("express").Router();
const { authenticate, isAdmin } = require("../middleware/auth");

const {
  getNotification,
  updateNotification,
} = require("../controller/NotificationController");

//User CRUD
router.get("/get", authenticate, isAdmin, getNotification);
router.post("/update/:id", authenticate, isAdmin, updateNotification);

module.exports = router;
