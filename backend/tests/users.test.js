const request = require("supertest");
const app = require("../src/app");
const db = require("../src/database/database");

jest.setTimeout(10000);

describe("User endpoints", () => {
  beforeAll((done) => {
    db.run("DELETE FROM users", done);
  });

  let token;
  let userId;

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

  it("should decode user ID from token for future tests", async () => {
    const decoded = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    userId = decoded.id;
    expect(userId).toBeDefined();
  });

  it("should update the user profile", async () => {
    const res = await request(app)
      .patch(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "updateduser",
        email: "updated@example.com",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("User updated successfully");
  });

  it("should not allow updating another user", async () => {
    const other = await request(app).post("/users/register").send({
      username: "otheruser",
      email: "other@example.com",
      password: "otherpass",
      role: "buyer",
    });

    const res = await request(app)
      .patch(`/users/${other.body.userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "hacker" });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/only update your own/i);
  });

  it("should delete the user account", async () => {
    const res = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });

  it("should not allow deleting another account", async () => {
    const login = await request(app).post("/users/login").send({
      email: "other@example.com",
      password: "otherpass",
    });

    const res = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/only delete your own/i);
  });
});
