import request from "supertest";
import { app } from "../../app.js";

describe("Group endpoints", () => {
  let competitionId: string;

  // Criamos uma competition real antes dos testes de group
  beforeAll(async () => {
    const res = await request(app)
      .post("/competition")
      .send({
        name: "World Cup Test Groups",
        signupDeadline: "2026-05-01T23:59:59.000Z",
      });

    competitionId = res.body.id;
  });

  it("should create a group", async () => {
    const res = await request(app)
      .post("/groups")
      .send({
        name: "Group A",
        competitionId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Group A");
    expect(res.body.competitionId).toBe(competitionId);
  });

  it("should fail without name", async () => {
    const res = await request(app)
      .post("/groups")
      .send({
        competitionId,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("name and competitionId are required");
  });

  it("should fail without competitionId", async () => {
    const res = await request(app)
      .post("/groups")
      .send({
        name: "Group B",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("name and competitionId are required");
  });

  it("should list groups", async () => {
    const res = await request(app).get("/groups");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
