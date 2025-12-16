import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Audit Service", () => {
  test("POST /audit should record an event", async () => {
    const event = {
      service: "auth-service",
      action: "USER_TEST",
      userId: "123"
    };

    const res = await request(app).post("/audit").send(event);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.action).toBe("USER_TEST");
  });

  test("GET /audit should list events", async () => {
    const res = await request(app).get("/audit");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
