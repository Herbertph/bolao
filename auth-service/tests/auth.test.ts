import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Auth Service - FULL FLOW", () => {

  let accessToken: string;
  let refreshToken: string;

  const userData = {
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john@example.com",
    password: "Password123!",
    confirmPassword: "Password123!"
  };

  // ------------------------------------------
  // REGISTER
  // ------------------------------------------
  test("POST /auth/register — should register user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  // ------------------------------------------
  // LOGIN
  // ------------------------------------------
  test("POST /auth/login — should login user", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        emailOrUsername: userData.email,
        password: userData.password
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  // ------------------------------------------
  // ME
  // ------------------------------------------
  test("GET /auth/me — should return user profile", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("email", userData.email);
    expect(res.body.user).toHaveProperty("username", userData.username);
  });

  // ------------------------------------------
  // REFRESH TOKEN
  // ------------------------------------------
  test("POST /auth/refresh — should refresh token", async () => {
    const res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  // ------------------------------------------
  // LOGOUT
  // ------------------------------------------
  test("POST /auth/logout — should logout the user", async () => {
    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Logged out");
  });

});
