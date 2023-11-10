const router = require("express").Router();
const { authenticate, isAdmin } = require("../middleware/auth");

const {
  uploadCourse,
  updateCourse,
  getSingleCourse,
  getAllCourses,
  getCourseByUser,
  addQuestion,
  addAnswer,
  addReview,
  addReplyToReview,
  getAllCoursesForAdmin,
  deleteCourse,
} = require("../controller/courseController");

//User CRUD
router.post("/create", authenticate, isAdmin, uploadCourse);
router.post("/update/:id", authenticate, isAdmin, updateCourse);
router.get("/getSingleCourse/:id", getSingleCourse);
router.get("/getAllCourses", getAllCourses);
router.get("/getCourseContent/:id", authenticate, getCourseByUser);
router.post("/addQuestion", authenticate, addQuestion);
router.post("/addAnswer", authenticate, addAnswer);
router.post("/addReview/:id", authenticate, addReview);
router.post("/addReplyToReview", authenticate, isAdmin, addReplyToReview);
router.delete("/delete/:id", authenticate, isAdmin, deleteCourse);
router.get(
  "/getAllCoursesForAdmin",
  authenticate,
  isAdmin,
  getAllCoursesForAdmin
);

module.exports = router;
