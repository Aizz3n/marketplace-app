const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController.js");
const authenticateToken = require("../middlewares/auth.js");

// Coloque a rota de seller antes do :id para evitar conflito na ordem
router.get("/sellers/:id/products", ProductController.getBySeller);

router.get("/:id", ProductController.getById);
router.get("/", ProductController.listAll);
router.post("/", authenticateToken, ProductController.create);
router.put("/:id", authenticateToken, ProductController.update);
router.delete("/:id", authenticateToken, ProductController.delete);

module.exports = router;
