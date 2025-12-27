import request from "supertest";
import { app } from "../../app.js";
import { Phase } from "@prisma/client";
import { createTestToken } from "../../utils/auth.js";

describe("Scoring Admin endpoint", () => {
  let competitionId: string;
  let groupId: string;
  let homeTeamId: string;
  let awayTeamId: string;
  let matchId: string;

  const adminToken = createTestToken({
    userId: "admin-1",
    role: "ADMIN",
  });

  beforeAll(async () => {
    const competitionRes = await request(app)
      .post("/competition")
      .send({
        name: "Scoring Admin Test Cup",
        signupDeadline: "2026-05-01T23:59:59.000Z",
      });

    competitionId = competitionRes.body.id;

    const groupRes = await request(app)
      .post("/groups")
      .send({
        name: "Group S",
        competitionId,
      });

    groupId = groupRes.body.id;

    const homeTeamRes = await request(app)
      .post("/teams")
      .send({
        name: "Brazil",
        fifaCode: `BRA-${Date.now()}`,
        groupId,
      });

    homeTeamId = homeTeamRes.body.id;

    const awayTeamRes = await request(app)
      .post("/teams")
      .send({
        name: "Germany",
        fifaCode: `GER-${Date.now()}`,
        groupId,
      });

    awayTeamId = awayTeamRes.body.id;

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

  it("should return 409 if match is not finished", async () => {
    const res = await request(app)
      .post(`/admin/score/${matchId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(409);
  });

  it("should score predictions after match is finished", async () => {
    await request(app)
      .patch(`/admin/matches/${matchId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        homeScore: 2,
        awayScore: 1,
      });

    const scoreRes = await request(app)
      .post(`/admin/score/${matchId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(scoreRes.status).toBe(200);
    expect(scoreRes.body.message).toBe("Match scored successfully");
  });

  it("should be idempotent (second call scores 0)", async () => {
    const res = await request(app)
      .post(`/admin/score/${matchId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.predictionsScored).toBe(0);
  });
});
