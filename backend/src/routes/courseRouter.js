const router = require("express").Router();
const { authenticate, isAdmin } = require("../middleware/auth");

const {
  uploadCourse,
  updateCourse,
} = require("../controller/courseController");

//User CRUD
router.post("/create", authenticate, isAdmin, uploadCourse);
router.post("/update/:id", authenticate, isAdmin, updateCourse);

module.exports = router;
