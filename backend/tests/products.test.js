const request = require("supertest");
const app = require("../src/app");
const db = require("../src/database/database");

jest.setTimeout(10000);

describe("Product endpoints", () => {
  let sellerToken;
  let productId;

  beforeAll((done) => {
    db.serialize(() => {
      db.run("DELETE FROM products");
      db.run("DELETE FROM users", done);
    });
  });

  it("should register a seller user", async () => {
    const res = await request(app).post("/users/register").send({
      username: "selleruser",
      email: "seller@example.com",
      password: "password123",
      role: "seller",
    });

    expect(res.statusCode).toEqual(201);
  });

  it("should login the seller and get token", async () => {
    const res = await request(app).post("/users/login").send({
      email: "seller@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    sellerToken = res.body.token;
  });

  it("should create a product with seller token", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({
        name: "Product 1",
        description: "Product description",
        price: 100,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("productID");
    productId = res.body.productID;
  });

  it("should list all products", async () => {
    const res = await request(app).get("/products");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("products");
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it("should get product by id", async () => {
    const res = await request(app).get(`/products/${productId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("product");
    expect(res.body.product.id).toBe(productId);
  });

  it("should update a product", async () => {
    const res = await request(app)
      .put(`/products/${productId}`)
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({
        name: "Updated Product",
        price: 150,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Product updated successfully");
  });

  it("should delete a product", async () => {
    const res = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${sellerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "Product deleted successfully. "
    );
  });

  it("should return 404 for deleted product", async () => {
    const res = await request(app).get(`/products/${productId}`);

    expect(res.statusCode).toEqual(404);
  });
});
