const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const OrderController = require("../controllers/OrderController");

router.post("/checkout", authenticateToken, OrderController.checkout);
router.get("/my-orders", authenticateToken, OrderController.listMyOrders);
router.get("/seller", authenticateToken, OrderController.listSellerOrders);

module.exports = router;
