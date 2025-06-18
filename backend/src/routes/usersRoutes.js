const express = require("express");
const UserController = require("../controllers/UserControllers.js");
const authenticateToken = require("../middlewares/auth");

const router = express.Router();

router.get("/", authenticateToken, UserController.listUsers);
router.get("/:id/products", UserController.getSellerWithProducts);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.patch("/:id", authenticateToken, UserController.updateUser);
router.delete("/:id", authenticateToken, UserController.deleteUser);

module.exports = router;
