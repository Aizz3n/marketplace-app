const express = require("express");
const UserController = require("../controllers/usersControllers");
const authenticateToken = require("../middlewares/auth");

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/", authenticateToken, UserController.listUsers);

module.exports = router;
