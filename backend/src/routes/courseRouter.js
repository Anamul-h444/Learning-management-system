const router = require("express").Router();
const { authenticate, isAdmin } = require("../middleware/auth");

const {
  uploadCourse,
  updateCourse,
  getSingleCourse,
  getAllCourses,
  getCourseByUser,
  addQuestion,
} = require("../controller/courseController");

//User CRUD
router.post("/create", authenticate, isAdmin, uploadCourse);
router.post("/update/:id", authenticate, isAdmin, updateCourse);
router.get("/getSingleCourse/:id", getSingleCourse);
router.get("/getAllCourses", getAllCourses);
router.get("/getCourseContent/:id", authenticate, getCourseByUser);
router.post("/addQuestion", authenticate, addQuestion);

module.exports = router;
