import request from "supertest";
import { app } from "../../app.js";
import { Phase } from "@prisma/client";

describe("Ranking endpoint", () => {
  let competitionId: string;
  let matchId: string;

  beforeAll(async () => {
    // Competition
    const competitionRes = await request(app)
      .post("/competition")
      .send({
        name: "Ranking Test Cup",
        signupDeadline: "2026-05-01T23:59:59.000Z",
      });

    competitionId = competitionRes.body.id;

    // Group
    const groupRes = await request(app)
      .post("/groups")
      .send({
        name: "Group R",
        competitionId,
      });

    const groupId = groupRes.body.id;

    // Teams
    const homeTeamRes = await request(app).post("/teams").send({
      name: "Argentina",
      fifaCode: `ARG-${Date.now()}`,
      groupId,
    });

    const awayTeamRes = await request(app).post("/teams").send({
      name: "France",
      fifaCode: `FRA-${Date.now()}`,
      groupId,
    });

    // Match
    const matchRes = await request(app).post("/matches").send({
      competitionId,
      phase: Phase.GROUP,
      startTime: "2026-06-15T16:00:00.000Z",
      homeTeamId: homeTeamRes.body.id,
      awayTeamId: awayTeamRes.body.id,
      groupId,
    });

    matchId = matchRes.body.id;

    // Predictions
    await request(app).post("/predictions").send({
      userId: "rank-user-1",
      matchId,
      predictedHomeScore: 2,
      predictedAwayScore: 1, // exact => 5
    });

    await request(app).post("/predictions").send({
      userId: "rank-user-2",
      matchId,
      predictedHomeScore: 1,
      predictedAwayScore: 0, // correct winner => 3
    });

    // Finish match
    await request(app).patch(`/admin/matches/${matchId}`).send({
      status: "FINISHED",
      homeScore: 2,
      awayScore: 1,
    });

    // Score match
    await request(app).post(`/admin/score/${matchId}`);
  });

  it("should return ranking ordered by points", async () => {
    const res = await request(app).get(
      `/ranking?competitionId=${competitionId}`
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);

    expect(res.body[0].userId).toBe("rank-user-1");
    expect(res.body[0].totalPoints).toBe(5);

    expect(res.body[1].userId).toBe("rank-user-2");
    expect(res.body[1].totalPoints).toBe(3);
  });
});
