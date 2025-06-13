const bcrypt = require("bcryptjs");
const db = require("../database/database");

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
        return res.status(401).json({ error: "Invalide credentials." });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.stauts(401).json({ error: "Invalid credentials." });
      }

      res.status(200).json({
        message: "Login sucessfully",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email,
        },
      });
    });
  },
};

module.exports = UserController;
