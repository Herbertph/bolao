import { prisma } from "../../lib/prisma.js";

export class RankingService {
  async getByCompetition(competitionId: string) {
    const predictions = await prisma.prediction.findMany({
      where: {
        match: {
          competitionId,
          status: "FINISHED",
        },
        pointsAwarded: {
          not: null,
        },
      },
      select: {
        userId: true,
        pointsAwarded: true,
      },
    });

    const map = new Map<
      string,
      {
        userId: string;
        totalPoints: number;
        exactHits: number;
        correctResults: number;
        wrong: number;
      }
    >();

    for (const p of predictions) {
      if (!map.has(p.userId)) {
        map.set(p.userId, {
          userId: p.userId,
          totalPoints: 0,
          exactHits: 0,
          correctResults: 0,
          wrong: 0,
        });
      }

      const row = map.get(p.userId)!;
      row.totalPoints += p.pointsAwarded!;

      if (p.pointsAwarded === 5) row.exactHits++;
      else if (p.pointsAwarded === 3) row.correctResults++;
      else row.wrong++;
    }

    return Array.from(map.values()).sort((a, b) => {
      if (b.totalPoints !== a.totalPoints)
        return b.totalPoints - a.totalPoints;

      if (b.exactHits !== a.exactHits)
        return b.exactHits - a.exactHits;

      if (b.correctResults !== a.correctResults)
        return b.correctResults - a.correctResults;

      return a.userId.localeCompare(b.userId);
    });
  }
}
