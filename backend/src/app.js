const express = require("express");
const app = express();
const db = require("./database/database");
const userRoutes = require("./routes/usersRoutes"); // nome do arquivo correto

app.use(express.json());

// Usar as rotas de usuários prefixadas com /users
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
