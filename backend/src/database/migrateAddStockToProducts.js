const db = require("./database");

db.serialize(() => {
  // Verifica se a coluna 'stock' já existe
  db.get(`PRAGMA table_info(products);`, (err, row) => {
    if (err) {
      console.error("Erro ao verificar colunas:", err.message);
      process.exit(1);
    }

    db.all(`PRAGMA table_info(products);`, (err, columns) => {
      if (err) {
        console.error("Erro ao listar colunas:", err.message);
        process.exit(1);
      }

      const stockExists = columns.some((col) => col.name === "stock");

      if (stockExists) {
        console.log(
          "Coluna 'stock' já existe na tabela products. Nada a fazer."
        );
        process.exit(0);
      } else {
        // Adiciona a coluna 'stock'
        db.run(
          `ALTER TABLE products ADD COLUMN stock INTEGER NOT NULL DEFAULT 0;`,
          (err) => {
            if (err) {
              console.error("Erro ao adicionar coluna stock:", err.message);
              process.exit(1);
            } else {
              console.log(
                "Coluna 'stock' adicionada com sucesso na tabela products."
              );
              process.exit(0);
            }
          }
        );
      }
    });
  });
});
