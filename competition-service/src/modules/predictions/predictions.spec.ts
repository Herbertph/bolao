import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../../app.js";
import { Phase } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "test-secret";

describe("Prediction endpoints", () => {
  let competitionId: string;
  let groupId: string;
  let homeTeamId: string;
  let awayTeamId: string;
  let matchId: string;

  const userId = "user-test-123";

  const token = jwt.sign(
    { sub: userId, role: "USER" },
    JWT_SECRET
  );

  beforeAll(async () => {
    // Competition
    const competitionRes = await request(app)
      .post("/competition")
      .send({
        name: "World Cup Predictions Test",
        signupDeadline: "2026-05-01T23:59:59.000Z",
      });

    competitionId = competitionRes.body.id;

    // Group
    const groupRes = await request(app)
      .post("/groups")
      .send({
        name: "Group B",
        competitionId,
      });

    groupId = groupRes.body.id;

    // Teams
    const homeTeamRes = await request(app)
      .post("/teams")
      .send({
        name: "France",
        fifaCode: `FRA-${Date.now()}`,
        groupId,
      });

    homeTeamId = homeTeamRes.body.id;

    const awayTeamRes = await request(app)
      .post("/teams")
      .send({
        name: "Japan",
        fifaCode: `JPN-${Date.now()}`,
        groupId,
      });

    awayTeamId = awayTeamRes.body.id;

    // Match
    const matchRes = await request(app)
      .post("/matches")
      .send({
        competitionId,
        phase: Phase.GROUP,
        startTime: "2026-06-14T16:00:00.000Z",
        homeTeamId,
        awayTeamId,
        groupId,
      });

    matchId = matchRes.body.id;
  });

  it("should create a prediction", async () => {
    const res = await request(app)
      .post("/predictions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        matchId,
        predictedHomeScore: 2,
        predictedAwayScore: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.userId).toBe(userId);
    expect(res.body.matchId).toBe(matchId);
  });

  it("should update prediction for same user and match", async () => {
    const res = await request(app)
      .post("/predictions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        matchId,
        predictedHomeScore: 3,
        predictedAwayScore: 2,
      });

    expect(res.status).toBe(201);
    expect(res.body.predictedHomeScore).toBe(3);
    expect(res.body.predictedAwayScore).toBe(2);
  });

  it("should fail without required fields", async () => {
    const res = await request(app)
      .post("/predictions")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("required");
  });

  it("should list predictions by matchId", async () => {
    const res = await request(app).get(
      `/predictions?matchId=${matchId}`
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should list predictions for logged user", async () => {
    const res = await request(app)
      .get("/predictions/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const prediction = res.body[0];
    expect(prediction.userId).toBe(userId);
  });
});
