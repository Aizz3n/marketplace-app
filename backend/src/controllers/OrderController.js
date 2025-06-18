const db = require("../database/database");

const OrderController = {
  checkout: (req, res) => {
    const buyer_id = req.user.id;

    const cartQuery = `
      SELECT ci.id AS cart_id, ci.product_id, ci.quantity, p.price, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.buyer_id = ?
    `;

    db.all(cartQuery, [buyer_id], (err, items) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!items.length)
        return res.status(400).json({ error: "Cart is empty" });

      // Verifica estoque
      for (let item of items) {
        if (item.quantity > item.stock) {
          return res.status(400).json({
            error: `Insufficient stock for product ${item.product_id}`,
          });
        }
      }

      const total = items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      // Cria pedido
      const insertOrder = `INSERT INTO orders (buyer_id, total) VALUES (?, ?)`;
      db.run(insertOrder, [buyer_id, total], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const order_id = this.lastID;

        const insertItem = db.prepare(`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `);
        const updateStock = db.prepare(`
          UPDATE products SET stock = stock - ? WHERE id = ?
        `);
        const deleteCart = db.prepare(`
          DELETE FROM cart_items WHERE id = ?
        `);

        db.serialize(() => {
          for (let item of items) {
            insertItem.run(
              order_id,
              item.product_id,
              item.quantity,
              item.price
            );
            updateStock.run(item.quantity, item.product_id);
            deleteCart.run(item.cart_id);
          }

          insertItem.finalize();
          updateStock.finalize();
          deleteCart.finalize();

          res.status(201).json({ message: "Order created", order_id });
        });
      });
    });
  },

  listMyOrders: (req, res) => {
    const buyer_id = req.user.id;

    const query = `
      SELECT o.id AS order_id, o.total, o.status, o.created_at,
             oi.product_id, oi.quantity, oi.price
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.buyer_id = ?
      ORDER BY o.created_at DESC
    `;

    db.all(query, [buyer_id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      const orders = {};

      rows.forEach((row) => {
        if (!orders[row.order_id]) {
          orders[row.order_id] = {
            order_id: row.order_id,
            total: row.total,
            status: row.status,
            created_at: row.created_at,
            items: [],
          };
        }

        orders[row.order_id].items.push({
          product_id: row.product_id,
          quantity: row.quantity,
          price: row.price,
        });
      });

      res.json({ orders: Object.values(orders) });
    });
  },
};

module.exports = OrderController;
