const express = require("express");
const app = express();
const db = require("./database/database");
const userRoutes = require("./routes/usersRoutes");
const productRoutes = require("./routes/productsRoutes");

app.use(express.json());
app.use("/users", userRoutes);
app.use("/products", productRoutes);

module.exports = app;
