import request from "supertest";
import { app } from "../../app.js";

describe("Round endpoints", () => {
  let competitionId: string;
  let groupId: string;
  let roundId: string;

  beforeAll(async () => {
    // Competition
    const competitionRes = await request(app)
      .post("/competition")
      .send({
        name: "World Cup Rounds Test",
        signupDeadline: "2026-05-01T23:59:59.000Z",
      });

    competitionId = competitionRes.body.id;

    // Group
    const groupRes = await request(app)
      .post("/groups")
      .send({
        name: "Group A",
        competitionId,
      });

    groupId = groupRes.body.id;
  });

  it("should create a round", async () => {
    const res = await request(app)
      .post("/rounds")
      .send({
        roundNumber: 1,
        groupId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.roundNumber).toBe(1);
    expect(res.body.groupId).toBe(groupId);

    roundId = res.body.id;
  });

  it("should fail without required fields", async () => {
    const res = await request(app)
      .post("/rounds")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("roundNumber");
    expect(res.body.message).toContain("groupId");
  });

  it("should list rounds by groupId", async () => {
    const res = await request(app).get(
      `/rounds?groupId=${groupId}`
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const round = res.body[0];
    expect(round.groupId).toBe(groupId);
  });

  it("should get round by id", async () => {
    const res = await request(app).get(`/rounds/${roundId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(roundId);
  });

  it("should return 404 for non-existing round", async () => {
    const res = await request(app).get(
      "/rounds/00000000-0000-0000-0000-000000000000"
    );

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Round not found");
  });
});
