const db = require("../database/database");

const ProductController = {
  create: (req, res) => {
    console.log("Create Product - req.body:", req.body);
    console.log("Create Product - req.user:", req.user);

    const { name, description, price, stock } = req.body;
    const seller_id = req.user.id;

    if (req.user.role !== "seller") {
      return res
        .status(403)
        .json({ error: "Only sellers can create products." });
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({ error: "Name is required and must be a non-empty string." });
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
      return res
        .status(400)
        .json({ error: "Price must be a positive number." });
    }

    if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0) {
      return res
        .status(400)
        .json({ error: "Stock must be a non-negative number." });
    }

    const query = `
      INSERT INTO products (name, description, price, stock, seller_id) 
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [name.trim(), description || "", Number(price), Number(stock), seller_id],
      function (err) {
        if (err) {
          console.error("DB error creating product:", err.message);
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
          message: "Product created successfully",
          productID: this.lastID,
        });
      }
    );
  },

  update: (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const seller_id = req.user.id;

    if (price !== undefined && (isNaN(price) || Number(price) <= 0)) {
      return res
        .status(400)
        .json({ error: "Price must be a positive number." });
    }

    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
      return res
        .status(400)
        .json({ error: "Stock must be a non-negative number." });
    }

    if (
      name !== undefined &&
      (typeof name !== "string" || name.trim() === "")
    ) {
      return res
        .status(400)
        .json({ error: "Name must be a non-empty string." });
    }

    if (req.user.role !== "seller") {
      return res
        .status(403)
        .json({ error: "Only sellers can update products." });
    }

    const selectQuery = "SELECT * FROM products WHERE id = ? AND seller_id = ?";
    db.get(selectQuery, [id, seller_id], (err, product) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!product) {
        return res
          .status(404)
          .json({ error: "Product not found or unauthorized." });
      }

      const updateQuery = `
        UPDATE products SET
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          price = COALESCE(?, price),
          stock = COALESCE(?, stock)
        WHERE id = ? AND seller_id = ?
      `;

      db.run(
        updateQuery,
        [name, description, price, stock, id, seller_id],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.json({ message: "Product updated successfully" });
        }
      );
    });
  },

  delete: (req, res) => {
    const { id } = req.params;
    const seller_id = req.user.id;

    if (req.user.role !== "seller") {
      return res
        .status(403)
        .json({ error: "Only sellers can delete products." });
    }

    const selectQuery = "SELECT * FROM products WHERE id = ? AND seller_id = ?";
    db.get(selectQuery, [id, seller_id], (err, product) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!product) {
        return res
          .status(404)
          .json({ error: "Product not found or unauthorized." });
      }

      const deleteQuery = "DELETE FROM products WHERE id = ? AND seller_id = ?";
      db.run(deleteQuery, [id, seller_id], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({ message: "Product deleted successfully." });
      });
    });
  },

  listAll: (req, res) => {
    const { name, minPrice, maxPrice } = req.query;

    let query = `SELECT * FROM products`;
    let conditions = [];
    let params = [];

    if (name) {
      conditions.push("name LIKE ?");
      params.push(`%${name}%`);
    }

    if (minPrice) {
      conditions.push("price >= ?");
      params.push(minPrice);
    }

    if (maxPrice) {
      conditions.push("price <= ?");
      params.push(maxPrice);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching products" });
      }

      return res.status(200).json({ products: rows });
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

  getBySeller: (req, res) => {
    const seller_id = req.params.id;

    const checkSellerQuery =
      "SELECT id, username, email FROM users WHERE id = ? AND role = 'seller'";

    db.get(checkSellerQuery, [seller_id], (err, seller) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!seller) {
        return res.status(404).json({ error: "Seller not found" });
      }

      const query = "SELECT * FROM products WHERE seller_id = ?";
      db.all(query, [seller_id], (err, products) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({
          seller,
          products,
        });
      });
    });
  },
  listMyProducts: (req, res) => {
    const sellerId = req.user.id;

    const query = `SELECT * FROM products WHERE seller_id = ?`;

    db.all(query, [sellerId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ products: rows });
    });
  },
};

module.exports = ProductController;
