const db = require("./database");

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('buyer', 'seller')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

db.run(createUsersTable, (err) => {
  if (err) {
    console.error("Error creating users table:", err.message);
  } else {
    console.log("Users table created or already exists.");
  }
  db.close();
});
