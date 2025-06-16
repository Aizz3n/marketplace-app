const express = require("express");
const UserController = require("../controllers/UserControllers.js");
const authenticateToken = require("../middlewares/auth");

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/", UserController.listUsers);

module.exports = router;
