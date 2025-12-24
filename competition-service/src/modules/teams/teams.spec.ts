import request from "supertest";
import { app } from "../../app.js";

describe("Team endpoints", () => {
  let competitionId: string;
  let groupId: string;
  let teamId: string;
  let fifaCode: string;

  // Criamos competition + group antes
  beforeAll(async () => {
    const competitionRes = await request(app)
      .post("/competition")
      .send({
        name: "World Cup Teams Test",
        signupDeadline: "2026-05-01T23:59:59.000Z",
      });

    competitionId = competitionRes.body.id;

    const groupRes = await request(app)
      .post("/groups")
      .send({
        name: "Group C",
        competitionId,
      });

    groupId = groupRes.body.id;
  });

  it("should create a team", async () => {
    fifaCode = `BRA-${Date.now()}`;

    const res = await request(app)
      .post("/teams")
      .send({
        name: "Brazil",
        fifaCode,
        groupId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Brazil");
    expect(res.body.fifaCode).toBe(fifaCode); // ✅ CORRETO
    expect(res.body.groupId).toBe(groupId);

    teamId = res.body.id;
  });

  it("should fail without required fields", async () => {
    const res = await request(app)
      .post("/teams")
      .send({
        name: "Argentina",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "name, fifaCode and groupId are required"
    );
  });

  it("should list all teams", async () => {
    const res = await request(app).get("/teams");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should list teams by groupId", async () => {
    const res = await request(app).get(`/teams?groupId=${groupId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const team = res.body[0];
    expect(team.groupId).toBe(groupId);
  });

  it("should get team by id", async () => {
    const res = await request(app).get(`/teams/${teamId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(teamId);
  });

  it("should return 404 for non-existing team", async () => {
    const res = await request(app).get(
      "/teams/00000000-0000-0000-0000-000000000000"
    );

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Team not found");
  });
});
