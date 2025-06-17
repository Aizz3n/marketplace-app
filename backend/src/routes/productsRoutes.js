const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController.js");
const authenticateToken = require("../middlewares/auth.js");

router.get("/", ProductController.listAll);
router.get("/:id", ProductController.getById);
router.get("/sellers/:id/products", ProductController.getBySeller);
router.post("/", authenticateToken, ProductController.create);
router.put("/:id", authenticateToken, ProductController.update);
router.delete("/:id", authenticateToken, ProductController.delete);

module.exports = router;
