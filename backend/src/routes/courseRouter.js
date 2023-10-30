const router = require("express").Router();
const { authenticate, isAdmin } = require("../middleware/auth");

const {
  uploadCourse,
  updateCourse,
  getSingleCourse,
} = require("../controller/courseController");

//User CRUD
router.post("/create", authenticate, isAdmin, uploadCourse);
router.post("/update/:id", authenticate, isAdmin, updateCourse);
router.get("/getSingleCourse/:id", getSingleCourse);

module.exports = router;
