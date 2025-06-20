const request = require("supertest");
const app = require("../src/app");
const db = require("../src/database/database");

jest.setTimeout(10000);

describe("Seller Orders Endpoint", () => {
  let sellerToken;
  let buyerToken;
  let productId;
  let orderId;

  beforeAll((done) => {
    db.serialize(() => {
      db.run("DELETE FROM order_items");
      db.run("DELETE FROM orders");
      db.run("DELETE FROM cart_items");
      db.run("DELETE FROM products");
      db.run("DELETE FROM users", done);
    });
  });

  it("should register and login a buyer", async () => {
    await request(app).post("/users/register").send({
      username: "buyer",
      email: "buyer@example.com",
      password: "password123",
      role: "buyer",
    });

    const res = await request(app).post("/users/login").send({
      email: "buyer@example.com",
      password: "password123",
    });

    buyerToken = res.body.token;
    expect(buyerToken).toBeDefined();
  });

  it("should register and login a seller, then create a product", async () => {
    await request(app).post("/users/register").send({
      username: "seller",
      email: "seller@example.com",
      password: "password123",
      role: "seller",
    });

    const loginRes = await request(app).post("/users/login").send({
      email: "seller@example.com",
      password: "password123",
    });

    sellerToken = loginRes.body.token;

    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({
        name: "Seller's Product",
        description: "Product description",
        price: 100,
        stock: 10,
      });

    productId = res.body.productID;
    expect(productId).toBeDefined();
  });

  it("should add product to buyer's cart", async () => {
    const res = await request(app)
      .post("/cart")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({
        product_id: productId,
        quantity: 2,
      });

    expect(res.statusCode).toBe(201);
  });

  it("should perform checkout and create an order", async () => {
    const res = await request(app)
      .post("/orders/checkout")
      .set("Authorization", `Bearer ${buyerToken}`);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("order_id");
    orderId = res.body.order_id;
  });

  it("should list seller's orders with their products", async () => {
    const res = await request(app)
      .get("/orders/seller-orders")
      .set("Authorization", `Bearer ${sellerToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.orders)).toBe(true);
    expect(res.body.orders.length).toBeGreaterThan(0);

    const order = res.body.orders.find((o) => o.order_id === orderId);
    expect(order).toBeDefined();
    expect(order.items.some((item) => item.product_id === productId)).toBe(
      true
    );
  });
});
