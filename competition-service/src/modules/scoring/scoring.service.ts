
import { prisma } from "../../lib/prisma.js";
import { MatchStatus } from "@prisma/client";

export class ScoringService {
  async scoreMatch(matchId: string) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        predictions: true,
      },
    });

    if (!match) {
      throw new Error("MATCH_NOT_FOUND");
    }

    if (match.status !== MatchStatus.FINISHED) {
      throw new Error("MATCH_NOT_FINISHED");
    }

    if (match.homeScore === null || match.awayScore === null) {
      throw new Error("MATCH_SCORE_NOT_SET");
    }

    const predictionsToScore = match.predictions.filter(
      (p) => p.pointsAwarded === null
    );

    // ✅ IDÊMPOTENTE
    if (predictionsToScore.length === 0) {
      return {
        matchId,
        predictionsScored: 0,
      };
    }

    const updates = predictionsToScore.map((prediction) => {
      const points = calculatePoints(
        match.homeScore!,
        match.awayScore!,
        prediction.predictedHomeScore,
        prediction.predictedAwayScore
      );

      return prisma.prediction.update({
        where: { id: prediction.id },
        data: { pointsAwarded: points },
      });
    });

    await prisma.$transaction(updates);

    return {
      matchId,
      predictionsScored: predictionsToScore.length,
    };
  }
}

// 🔒 Função pura (exportável para teste)
export function calculatePoints(
  homeScore: number,
  awayScore: number,
  predictedHome: number,
  predictedAway: number
): number {
  // 1️⃣ Placar exato
  if (
    homeScore === predictedHome &&
    awayScore === predictedAway
  ) {
    return 5;
  }

  const actualDiff = homeScore - awayScore;
  const predictedDiff = predictedHome - predictedAway;

  const actualResult = Math.sign(actualDiff);
  const predictedResult = Math.sign(predictedDiff);

  // 2️⃣ Resultado correto (vitória / empate / derrota)
  if (actualResult === predictedResult) {
    return 3;
  }

  // 3️⃣ Apenas um lado correto (mas resultado errado)
  if (
    homeScore === predictedHome ||
    awayScore === predictedAway
  ) {
    return 1;
  }

  // 4️⃣ Errado
  return 0;
}
