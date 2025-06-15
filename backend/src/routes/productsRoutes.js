const express = require("express");
const ProductController = require("../controllers/ProductController");
const authenticateToken = require("../middlewares/auth");

const router = express.Router();

router.post("/", authenticateToken, ProductController.create);
router.get("/", ProductController.listAll);
router.get("/:id", ProductController.getById);

module.exports = router;
