const request = require("supertest");
const app = require("../src/app");
const db = require("../src/database/database");

jest.setTimeout(10000);

describe("User endpoints", () => {
  beforeAll((done) => {
    db.run("DELETE FROM users", done);
  });

  let token;

  it("should register a new user", async () => {
    const res = await request(app).post("/users/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "buyer",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("userID");
  });

  it("should login the user and return a token", async () => {
    const res = await request(app).post("/users/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should get the users list with valid token", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("users");
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it("should fail to get users list without token", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toEqual(401);
  });
});
