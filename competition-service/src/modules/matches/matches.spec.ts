import request from "supertest";
import { app } from "../../app.js";
import { Phase } from "@prisma/client";

describe("Match endpoints", () => {
  let competitionId: string;
  let groupId: string;
  let homeTeamId: string;
  let awayTeamId: string;
  let matchId: string;

  beforeAll(async () => {
    // 1. Competition
    const competitionRes = await request(app)
      .post("/competition")
      .send({
        name: "World Cup Matches Test",
        signupDeadline: "2026-05-01T23:59:59.000Z",
      });

    competitionId = competitionRes.body.id;

    // 2. Group
    const groupRes = await request(app)
      .post("/groups")
      .send({
        name: "Group C",
        competitionId,
      });

    groupId = groupRes.body.id;

    // 3. Home Team
    const homeTeamRes = await request(app)
      .post("/teams")
      .send({
        name: "Brazil",
        fifaCode: `BRA-${Date.now()}`,
        groupId,
      });

    homeTeamId = homeTeamRes.body.id;

    // 4. Away Team
    const awayTeamRes = await request(app)
      .post("/teams")
      .send({
        name: "Scotland",
        fifaCode: `SCO-${Date.now()}`,
        groupId,
      });

    awayTeamId = awayTeamRes.body.id;
  });

  it("should create a match", async () => {
    const res = await request(app)
      .post("/matches")
      .send({
        competitionId,
        phase: Phase.GROUP,
        startTime: "2026-06-13T19:00:00.000Z",
        homeTeamId,
        awayTeamId,
        groupId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.competitionId).toBe(competitionId);
    expect(res.body.phase).toBe(Phase.GROUP);
    expect(res.body.groupId).toBe(groupId);

    matchId = res.body.id;
  });

  it("should fail without required fields", async () => {
    const res = await request(app)
      .post("/matches")
      .send({
        competitionId,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("required");
  });

  it("should fail with invalid phase", async () => {
    const res = await request(app)
      .post("/matches")
      .send({
        competitionId,
        phase: "INVALID_PHASE",
        startTime: "2026-06-13T19:00:00.000Z",
        homeTeamId,
        awayTeamId,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid phase value");
  });

  it("should list matches by competitionId", async () => {
    const res = await request(app).get(
      `/matches?competitionId=${competitionId}`
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should list matches by competitionId and groupId", async () => {
    const res = await request(app).get(
      `/matches?competitionId=${competitionId}&groupId=${groupId}`
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const match = res.body[0];
    expect(match.groupId).toBe(groupId);
  });

  it("should get match by id", async () => {
    const res = await request(app).get(`/matches/${matchId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(matchId);
  });

  it("should return 404 for non-existing match", async () => {
    const res = await request(app).get(
      "/matches/00000000-0000-0000-0000-000000000000"
    );

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Match not found");
  });
});
