const router = require("express").Router();
const { authenticate, isAdmin } = require("../middleware/auth");

const {
  getUserAnalytics,
  getCourseAnalytics,
  getOrderAnalytics,
} = require("../controller/analyticsController");

//User CRUD
router.get("/users/get", authenticate, isAdmin, getUserAnalytics);
router.get("/courses/get", authenticate, isAdmin, getCourseAnalytics);
router.get("/orders/get", authenticate, isAdmin, getOrderAnalytics);

module.exports = router;
