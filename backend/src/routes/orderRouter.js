const router = require("express").Router();
const { authenticate, isAdmin } = require("../middleware/auth");

const { createOrder, getAllOrders } = require("../controller/orderController");

//User CRUD
router.post("/create", authenticate, isAdmin, createOrder);
router.get("/get", authenticate, isAdmin, getAllOrders);

module.exports = router;
