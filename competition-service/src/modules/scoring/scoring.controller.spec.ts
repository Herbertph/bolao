import request from "supertest";
import { app } from "../../app.js";
import { Phase } from "@prisma/client";

describe("Scoring Admin endpoint", () => {
  let competitionId: string;
  let groupId: string;
  let homeTeamId: string;
  let awayTeamId: string;
  let matchId: string;

  const userA = "score-user-a";
  const userB = "score-user-b";
  const userC = "score-user-c";

  beforeAll(async () => {
    // 1) Competition
    const competitionRes = await request(app)
      .post("/competition")
      .send({
        name: "Scoring Admin Test Cup",
        signupDeadline: "2026-05-01T23:59:59.000Z",
      });

    expect(competitionRes.status).toBe(201);
    competitionId = competitionRes.body.id;

    // 2) Group
    const groupRes = await request(app)
      .post("/groups")
      .send({
        name: "Group S",
        competitionId,
      });

    expect(groupRes.status).toBe(201);
    groupId = groupRes.body.id;

    // 3) Teams
    const homeTeamRes = await request(app)
      .post("/teams")
      .send({
        name: "Brazil",
        fifaCode: `BRA-${Date.now()}`,
        groupId,
      });

    expect(homeTeamRes.status).toBe(201);
    homeTeamId = homeTeamRes.body.id;

    const awayTeamRes = await request(app)
      .post("/teams")
      .send({
        name: "Germany",
        fifaCode: `GER-${Date.now()}`,
        groupId,
      });

    expect(awayTeamRes.status).toBe(201);
    awayTeamId = awayTeamRes.body.id;

    // 4) Match (cria como SCHEDULED)
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

    expect(matchRes.status).toBe(201);
    matchId = matchRes.body.id;

    // 5) Predictions (3 users)
    // A: exact score (2-1) => 5
    await request(app).post("/predictions").send({
      userId: userA,
      matchId,
      predictedHomeScore: 2,
      predictedAwayScore: 1,
    });

    // B: correct winner (3-1) => 3
    await request(app).post("/predictions").send({
      userId: userB,
      matchId,
      predictedHomeScore: 3,
      predictedAwayScore: 1,
    });

    // C: wrong (0-2) => 0
    await request(app).post("/predictions").send({
      userId: userC,
      matchId,
      predictedHomeScore: 0,
      predictedAwayScore: 2,
    });
  });

  it("should return 409 if match is not finished", async () => {
    const res = await request(app).post(`/admin/score/${matchId}`);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Match is not finished yet");
  });

  it("should score predictions after match is finished", async () => {
    // finalize match first
    const patchRes = await request(app)
  .patch(`/admin/matches/${matchId}`)
  .send({
    status: "FINISHED",
    homeScore: 2,
    awayScore: 1,
  });

expect([200, 204]).toContain(patchRes.status);

    // run scoring
    const scoreRes = await request(app).post(`/admin/score/${matchId}`);

    expect(scoreRes.status).toBe(200);
    expect(scoreRes.body.message).toBe("Match scored successfully");
    expect(scoreRes.body.predictionsScored).toBe(3);

    // validate points via list by matchId
    const listRes = await request(app).get(`/predictions?matchId=${matchId}`);

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);

    const byUser: Record<string, any> = {};
    for (const p of listRes.body) byUser[p.userId] = p;

    expect(byUser[userA].pointsAwarded).toBe(5);
    expect(byUser[userB].pointsAwarded).toBe(3);
    expect(byUser[userC].pointsAwarded).toBe(0);
  });

  it("should be idempotent (second call scores 0)", async () => {
    const scoreRes = await request(app).post(`/admin/score/${matchId}`);

    expect(scoreRes.status).toBe(200);
    expect(scoreRes.body.predictionsScored).toBe(0);
  });

  it("should return 400 without matchId", async () => {
    const res = await request(app).post("/admin/score/");

    // dependendo do express/router, pode cair 404 (rota não bate) em vez de 400.
    // Se cair 404, está ok — significa que você protegeu a rota corretamente.
    expect([400, 404]).toContain(res.status);
  });
});
