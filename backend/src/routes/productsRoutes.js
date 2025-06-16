const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController.js");
const authenticateToken = require("../middlewares/auth.js");

router.post("/", authenticateToken, ProductController.create);
router.get("/", ProductController.listAll);
router.get("/:id", ProductController.getById);

module.exports = router;
