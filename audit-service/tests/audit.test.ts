import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";
import { Audit } from "../src/models/Audit";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "audit-test" } as any);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Audit Service - Endpoints", () => {

  test("POST /audit — should create an audit log", async () => {
    const payload = {
      service: "auth-service",
      action: "USER_REGISTER",
      userId: "12345",
      metadata: { email: "john@example.com" }
    };

    const res = await request(app).post("/audit").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Audit recorded");

    const logs = await Audit.find();
    expect(logs.length).toBe(1);
    expect(logs[0].service).toBe("auth-service");
  });

  test("POST /audit — should reject invalid data", async () => {
    const res = await request(app).post("/audit").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

});
