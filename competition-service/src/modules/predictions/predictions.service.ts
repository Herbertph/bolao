import { prisma } from "../../lib/prisma.js";

interface CreateOrUpdatePredictionInput {
  userId: string;
  matchId: string;
  predictedHomeScore: number;
  predictedAwayScore: number;
}

export class PredictionsService {
  async createOrUpdate(data: CreateOrUpdatePredictionInput) {
    // Verifica se já existe e está locked
    const existing = await prisma.prediction.findUnique({
      where: {
        userId_matchId: {
          userId: data.userId,
          matchId: data.matchId,
        },
      },
    });

    if (existing?.locked) {
      throw new Error("PREDICTION_LOCKED");
    }

    return prisma.prediction.upsert({
      where: {
        userId_matchId: {
          userId: data.userId,
          matchId: data.matchId,
        },
      },
      update: {
        predictedHomeScore: data.predictedHomeScore,
        predictedAwayScore: data.predictedAwayScore,
      },
      create: {
        userId: data.userId,
        matchId: data.matchId,
        predictedHomeScore: data.predictedHomeScore,
        predictedAwayScore: data.predictedAwayScore,
      },
    });
  }

  async listByUser(userId: string) {
    return prisma.prediction.findMany({
      where: { userId },
      include: {
        match: true,
      },
    });
  }

  async listByMatch(matchId: string) {
    return prisma.prediction.findMany({
      where: { matchId },
    });
  }

  async lockPredictions(matchId: string) {
    return prisma.prediction.updateMany({
      where: {
        matchId,
        locked: false,
      },
      data: {
        locked: true,
        lockedAt: new Date(),
      },
    });
  }
}
