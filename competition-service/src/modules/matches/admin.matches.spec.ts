import request from "supertest";
import { app } from "../../app.js";
import { Phase } from "@prisma/client";
import { createTestToken } from "../../utils/auth.js";

describe("Admin Matches – finish match", () => {
  const adminToken = createTestToken({
    userId: "admin-1",
    role: "ADMIN",
  });

  let matchId: string;

  beforeAll(async () => {
    const competition = await request(app).post("/competition").send({
      name: "Admin Match Test",
      signupDeadline: "2026-05-01T00:00:00Z",
    });

    const group = await request(app).post("/groups").send({
      name: "Group A",
      competitionId: competition.body.id,
    });

    const teamA = await request(app).post("/teams").send({
      name: "Team A",
      fifaCode: `TA-${Date.now()}`,
      groupId: group.body.id,
    });

    const teamB = await request(app).post("/teams").send({
      name: "Team B",
      fifaCode: `TB-${Date.now()}`,
      groupId: group.body.id,
    });

    const match = await request(app).post("/matches").send({
      competitionId: competition.body.id,
      phase: Phase.GROUP,
      startTime: new Date().toISOString(),
      homeTeamId: teamA.body.id,
      awayTeamId: teamB.body.id,
      groupId: group.body.id,
    });

    matchId = match.body.id;
  });

  it("should finish a match", async () => {
    const res = await request(app)
      .patch(`/admin/matches/${matchId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        homeScore: 1,
        awayScore: 0,
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("FINISHED");
  });

  it("should not allow finishing twice", async () => {
    const res = await request(app)
      .patch(`/admin/matches/${matchId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        homeScore: 2,
        awayScore: 1,
      });

    expect(res.status).toBe(409);
  });
});
