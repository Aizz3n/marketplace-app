const bcrypt = require("bcryptjs");
const db = require("../database/database");
const jwt = require("jsonwebtoken");

const UserController = {
  register: async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!["buyer", "seller"].includes(role)) {
      return res.status(400).json({ error: "Invalid role." });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertUser = `
        INSERT INTO users (username, email, password, role)
        VALUES (?, ?, ?, ?)
      `;

      db.run(
        insertUser,
        [username, email, hashedPassword, role],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.status(201).json({
            message: "User registered successfully",
            userID: this.lastID,
          });
        }
      );
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  login: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const query = `SELECT * FROM users WHERE email = ?`;

    db.get(query, [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successfully",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email,
        },
      });
    });
  },

  listUsers: (req, res) => {
    db.all(
      "SELECT id, username, email, role, created_at FROM users",
      [],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ users: rows });
      }
    );
  },

  getSellerWithProducts: (req, res) => {
    const sellerId = req.params.id;

    const userQuery =
      "SELECT id, username, email FROM users WHERE id = ? AND role = 'seller'";

    db.get(userQuery, [sellerId], (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(404).json({ error: "Seller not found" });
      }

      const productsQuery = "SELECT * FROM products WHERE seller_id = ?";

      db.all(productsQuery, [sellerId], (err, products) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({
          seller: user,
          products: products,
        });
      });
    });
  },
};

module.exports = UserController;
