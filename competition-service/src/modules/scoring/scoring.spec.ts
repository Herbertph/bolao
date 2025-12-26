import { calculatePoints, ScoringService } from "./scoring.service.js";
import { prisma } from "../../lib/prisma.js";
import { Phase, MatchStatus } from "@prisma/client";

describe("ScoringService – calculatePoints", () => {
  it("should give 5 points for exact score", () => {
    expect(calculatePoints(2, 1, 2, 1)).toBe(5);
  });

  it("should give 3 points for correct winner", () => {
    expect(calculatePoints(3, 1, 2, 0)).toBe(3);
  });

  it("should give 3 points for correct draw", () => {
    expect(calculatePoints(1, 1, 0, 0)).toBe(3);
  });

  it("should give 1 point for one score correct but wrong winner", () => {
    // Placar real: 2x1 (mandante vence)
    // Palpite: 2x3 (visitante vence)
    // Acertou apenas UM placar, mas errou o vencedor
    expect(calculatePoints(2, 1, 2, 3)).toBe(1);
  });

  it("should give 0 points for completely wrong prediction", () => {
    expect(calculatePoints(2, 1, 0, 3)).toBe(0);
  });
});

describe("ScoringService – scoreMatch", () => {
  const service = new ScoringService();

  let competitionId: string;
  let groupId: string;
  let homeTeamId: string;
  let awayTeamId: string;
  let matchId: string;
  const userId = "scoring-user-1";

  beforeAll(async () => {
    // Competition
    const competition = await prisma.competition.create({
      data: {
        name: "Scoring Test Cup",
        signupDeadline: new Date("2026-05-01"),
      },
    });
    competitionId = competition.id;

    // Group
    const group = await prisma.group.create({
      data: {
        name: "Group A",
        competitionId,
      },
    });
    groupId = group.id;

    // Teams (fifaCode ÚNICO)
    const homeTeam = await prisma.team.create({
      data: {
        name: "Brazil",
        fifaCode: `BRA-SCORE-${Date.now()}`,
        groupId,
      },
    });
    homeTeamId = homeTeam.id;

    const awayTeam = await prisma.team.create({
      data: {
        name: "Germany",
        fifaCode: `GER-SCORE-${Date.now()}`,
        groupId,
      },
    });
    awayTeamId = awayTeam.id;

    // Match (FINALIZADO)
    const match = await prisma.match.create({
      data: {
        competitionId,
        phase: Phase.GROUP,
        startTime: new Date(),
        homeTeamId,
        awayTeamId,
        groupId,
        status: MatchStatus.FINISHED,
        homeScore: 2,
        awayScore: 1,
      },
    });
    matchId = match.id;

    // Prediction (exata)
    await prisma.prediction.create({
      data: {
        userId,
        matchId,
        predictedHomeScore: 2,
        predictedAwayScore: 1,
      },
    });
  });

  it("should score predictions for finished match", async () => {
    const result = await service.scoreMatch(matchId);

    expect(result.predictionsScored).toBe(1);

    const prediction = await prisma.prediction.findFirst({
      where: { matchId, userId },
    });

    expect(prediction?.pointsAwarded).toBe(5);
  });

  it("should not rescore predictions (idempotent)", async () => {
    const result = await service.scoreMatch(matchId);
    expect(result.predictionsScored).toBe(0);
  });

  it("should fail if match is not finished", async () => {
    const pendingMatch = await prisma.match.create({
      data: {
        competitionId,
        phase: Phase.GROUP,
        startTime: new Date(),
        homeTeamId,
        awayTeamId,
        groupId,
        status: MatchStatus.SCHEDULED,
      },
    });

    await expect(
      service.scoreMatch(pendingMatch.id)
    ).rejects.toThrow("MATCH_NOT_FINISHED");
  });
});
