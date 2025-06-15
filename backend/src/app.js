const express = require("express");
const app = express();
const db = require("./database/database");
const userRoutes = require("./routes/usersRoutes");

app.use(express.json());
app.use("/users", userRoutes);

module.exports = app;
