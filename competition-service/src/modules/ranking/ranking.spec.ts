import request from "supertest";
import { app } from "../../app.js";
import { Phase } from "@prisma/client";
import { createTestToken } from "../../utils/auth.js";

describe("Ranking endpoint", () => {
  const adminToken = createTestToken({
    userId: "admin-ranking",
    role: "ADMIN",
  });

  const user1 = "rank-user-1";
  const user2 = "rank-user-2";

  const user1Token = createTestToken({ userId: user1 });
  const user2Token = createTestToken({ userId: user2 });

  let competitionId: string;
  let groupId: string;
  let homeTeamId: string;
  let awayTeamId: string;
  let matchId!: string;

  beforeAll(async () => {
    // 1) Competition
    const competitionRes = await request(app)
      .post("/competition")
      .send({
        name: "Ranking Test Cup",
        signupDeadline: "2026-05-01T23:59:59.000Z",
      });

    competitionId = competitionRes.body.id;

    // 2) Group
    const groupRes = await request(app)
      .post("/groups")
      .send({
        name: "Group R",
        competitionId,
      });

    groupId = groupRes.body.id;

    // 3) Teams
    const homeTeamRes = await request(app)
      .post("/teams")
      .send({
        name: "Argentina",
        fifaCode: `ARG-${Date.now()}`,
        groupId,
      });

    homeTeamId = homeTeamRes.body.id;

    const awayTeamRes = await request(app)
      .post("/teams")
      .send({
        name: "France",
        fifaCode: `FRA-${Date.now()}`,
        groupId,
      });

    awayTeamId = awayTeamRes.body.id;

    // 4) Match
    const matchRes = await request(app)
      .post("/matches")
      .send({
        competitionId,
        phase: Phase.GROUP,
        startTime: new Date().toISOString(),
        homeTeamId,
        awayTeamId,
        groupId,
      });

    matchId = matchRes.body.id;

    // 5) Predictions
    await request(app)
      .post("/predictions")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({
        matchId,
        predictedHomeScore: 2,
        predictedAwayScore: 1,
      });

    await request(app)
      .post("/predictions")
      .set("Authorization", `Bearer ${user2Token}`)
      .send({
        matchId,
        predictedHomeScore: 3,
        predictedAwayScore: 1,
      });

    // 6) Finish match (ADMIN)
    await request(app)
      .patch(`/admin/matches/${matchId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        homeScore: 2,
        awayScore: 1,
      });

    // 7) Score match (ADMIN)
    const scoreRes = await request(app)
      .post(`/admin/score/${matchId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(scoreRes.status).toBe(200);
  });

  it("should return ranking ordered by points", async () => {
    const res = await request(app).get(
      `/ranking?competitionId=${competitionId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);

    expect(res.body[0].userId).toBe(user1);
    expect(res.body[0].totalPoints).toBe(5);
    expect(res.body[0].exactHits).toBe(1);

    expect(res.body[1].userId).toBe(user2);
    expect(res.body[1].totalPoints).toBe(3);
    expect(res.body[1].correctResults).toBe(1);
  });
});
