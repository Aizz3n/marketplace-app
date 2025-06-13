const express = require("express");
const app = express();
const db = require("./database/database");
const userRoutes = require("./routes/usersRoutes");

app.use(express.json());

app.use("/users", userRoutes);

app.get("/users", (req, res) => {
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
});

module.exports = app;
