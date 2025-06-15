const db = require("../database/database");

const ProductController = {
  create: (req, res) => {
    const { name, description, price } = req.body;
    const seller_id = req.user.id;

    if (req.user.role !== "seller") {
      return res
        .status(403)
        .json({ error: "Only sellers can create products." });
    }

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required." });
    }

    const query = `
      INSERT INTO products (name, description, price, seller_id)
      VALUES (?, ?, ?, ?)
    `;

    db.run(query, [name, description, price, seller_id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Product created successfully",
        productID: this.lastID,
      });
    });
  },

  listAll: (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ products: rows });
    });
  },

  getById: (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM products WHERE id = ?", [id], (err, product) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }

      res.json({ product });
    });
  },
};

module.exports = ProductController;
