const router = require("express").Router();
const { authenticate, isAdmin } = require("../middleware/auth");

const {
  createLayout,
  editLayout,
  getLayoutByType,
} = require("../controller/layoutController");

//User CRUD
router.post("/create", authenticate, isAdmin, createLayout);
router.post("/edit", authenticate, isAdmin, editLayout);
router.post("/get", getLayoutByType);

module.exports = router;
