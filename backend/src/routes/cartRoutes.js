const express = require("express");
const CartController = require("../controllers/CartController");
const authenticateToken = require("../middlewares/auth");

const router = express.Router();

router.post("/", authenticateToken, CartController.addToCart);
router.get("/", authenticateToken, CartController.getCart);
router.put("/:id", authenticateToken, CartController.updateQuantity);
router.delete("/:id", authenticateToken, CartController.removeFromCart);

module.exports = router;
