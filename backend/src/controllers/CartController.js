const db = require("../database/database");

const CartController = {
  addToCart: (req, res) => {
    const buyer_id = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ error: "Product ID and positive quantity are required." });
    }

    const selectCart =
      "SELECT * FROM cart_items WHERE buyer_id = ? AND product_id = ?";

    db.get(selectCart, [buyer_id, product_id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (row) {
        const newQuantity = row.quantity + quantity;
        const updateQuery = "UPDATE cart_items SET quantity = ? WHERE id = ?";
        db.run(updateQuery, [newQuantity, row.id], function (err) {
          if (err) return res.status(500).json({ error: err.message });

          res.json({ message: "Quantity updated in cart." });
        });
      } else {
        const insertQuery =
          "INSERT INTO cart_items (buyer_id, product_id, quantity) VALUES (?, ?, ?)";
        db.run(insertQuery, [buyer_id, product_id, quantity], function (err) {
          if (err) return res.status(500).json({ error: err.message });

          res.status(201).json({ message: "Product added to cart." });
        });
      }
    });
  },

  getCart: (req, res) => {
    const buyer_id = req.user.id;

    const query = `
      SELECT ci.id AS cart_id, p.id AS product_id, p.name, p.description, p.price, ci.quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.buyer_id = ?
    `;

    db.all(query, [buyer_id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ cart: rows });
    });
  },

  updateQuantity: (req, res) => {
    const buyer_id = req.user.id;
    const cart_id = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ error: "Quantity must be a positive integer." });
    }

    const selectQuery =
      "SELECT * FROM cart_items WHERE id = ? AND buyer_id = ?";
    db.get(selectQuery, [cart_id, buyer_id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!row) return res.status(404).json({ error: "Cart item not found." });

      const updateQuery = "UPDATE cart_items SET quantity = ? WHERE id = ?";
      db.run(updateQuery, [quantity, cart_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Cart quantity updated." });
      });
    });
  },

  removeFromCart: (req, res) => {
    const buyer_id = req.user.id;
    const cart_id = req.params.id;

    const selectQuery =
      "SELECT * FROM cart_items WHERE id = ? AND buyer_id = ?";
    db.get(selectQuery, [cart_id, buyer_id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!row) return res.status(404).json({ error: "Cart item not found." });

      const deleteQuery = "DELETE FROM cart_items WHERE id = ?";
      db.run(deleteQuery, [cart_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Product removed from cart." });
      });
    });
  },
};

module.exports = CartController;
