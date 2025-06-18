const request = require("supertest");
const app = require("../src/app");
const db = require("../src/database/database");

jest.setTimeout(10000);

describe("Cart endpoints", () => {
  let token;
  let cartItemId;
  let productId;

  beforeAll((done) => {
    db.serialize(() => {
      db.run("DELETE FROM cart_items");
      db.run("DELETE FROM users");
      db.run("DELETE FROM products", done);
    });
  });

  it("should register and login a seller", async () => {
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

    token = loginRes.body.token;
  });

  it("should create a product", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Product",
        description: "Test desc",
        price: 50,
        stock: 10,
      });

    productId = res.body.productID;
    expect(res.statusCode).toBe(201);
  });

  it("should add product to cart", async () => {
    const res = await request(app)
      .post("/cart")
      .set("Authorization", `Bearer ${token}`)
      .send({
        product_id: productId,
        quantity: 2,
      });

    expect(res.statusCode).toBe(201);
  });

  it("should get cart items", async () => {
    const res = await request(app)
      .get("/cart")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.cart)).toBe(true);
    expect(res.body.cart.length).toBeGreaterThan(0);
    cartItemId = res.body.cart[0].cart_id;
  });

  it("should update quantity in cart", async () => {
    const res = await request(app)
      .put(`/cart/${cartItemId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Cart quantity updated.");
  });

  it("should remove product from cart", async () => {
    const res = await request(app)
      .delete(`/cart/${cartItemId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product removed from cart.");
  });
});
