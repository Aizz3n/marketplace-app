const db = require("./database");

db.serialize(() => {
  db.get(`PRAGMA table_info(products);`, (err, row) => {
    if (err) {
      console.error("Error checking columns:", err.message);
      process.exit(1);
    }

    db.all(`PRAGMA table_info(products);`, (err, columns) => {
      if (err) {
        console.error("Error checking columns:", err.message);
        process.exit(1);
      }

      const stockExists = columns.some((col) => col.name === "stock");

      if (stockExists) {
        console.log("Column 'stock' already exists in the products table");
        process.exit(0);
      } else {
        db.run(
          `ALTER TABLE products ADD COLUMN stock INTEGER NOT NULL DEFAULT 0;`,
          (err) => {
            if (err) {
              console.error("Error adding stock column:", err.message);
              process.exit(1);
            } else {
              console.log(
                "Column 'stock' successfully added to products table."
              );
              process.exit(0);
            }
          }
        );
      }
    });
  });
});
