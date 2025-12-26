import request from "supertest";
import { app } from "../../app.js";
import { Phase } from "@prisma/client";

describe("Admin Matches – finish match", () => {
  let competitionId: string;
  let groupId: string;
  let homeTeamId: string;
  let awayTeamId: string;
  let matchId: string;

  beforeAll(async () => {
    const competition = await request(app)
      .post("/competition")
      .send({
        name: "Admin Match Test Cup",
        signupDeadline: "2026-05-01T23:59:59.000Z",
      });

    competitionId = competition.body.id;

    const group = await request(app)
      .post("/groups")
      .send({
        name: "Group A",
        competitionId,
      });

    groupId = group.body.id;

    const home = await request(app)
      .post("/teams")
      .send({
        name: "Brazil",
        fifaCode: `BRA-${Date.now()}`,
        groupId,
      });

    homeTeamId = home.body.id;

    const away = await request(app)
      .post("/teams")
      .send({
        name: "Germany",
        fifaCode: `GER-${Date.now()}`,
        groupId,
      });

    awayTeamId = away.body.id;

    const match = await request(app)
      .post("/matches")
      .send({
        competitionId,
        phase: Phase.GROUP,
        startTime: "2026-06-14T16:00:00.000Z",
        homeTeamId,
        awayTeamId,
        groupId,
      });

    matchId = match.body.id;
  });

  it("should finish a match", async () => {
    const res = await request(app)
      .post(`/admin/matches/${matchId}/finish`)
      .send({
        homeScore: 2,
        awayScore: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("FINISHED");
    expect(res.body.homeScore).toBe(2);
    expect(res.body.awayScore).toBe(1);
  });

  it("should not allow finishing twice", async () => {
    const res = await request(app)
      .post(`/admin/matches/${matchId}/finish`)
      .send({
        homeScore: 3,
        awayScore: 2,
      });

    expect(res.status).toBe(409);
  });
});
