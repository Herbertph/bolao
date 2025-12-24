import request from "supertest";
import { app } from "../../app.js";

describe("Competition endpoints", () => {
  it("should create a competition", async () => {
    const res = await request(app)
      .post("/competition")
      .send({
        name: "World Cup 2026",
        signupDeadline: "2026-05-01T23:59:59.000Z",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("World Cup 2026");
  });

  it("should fail without required fields", async () => {
    const res = await request(app).post("/competition").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should list competitions", async () => {
    const res = await request(app).get("/competition");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
