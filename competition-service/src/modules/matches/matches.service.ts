// src/modules/matches/matches.service.ts
import { prisma } from "../../lib/prisma.js";
import { MatchStatus, Phase } from "@prisma/client";

interface CreateMatchInput {
  competitionId: string;
  phase: Phase;
  startTime: Date;
  homeTeamId: string;
  awayTeamId: string;
  groupId?: string;
  roundId?: string;
}

export class MatchesService {
  async create(data: CreateMatchInput) {
    return prisma.match.create({
      data: {
        competitionId: data.competitionId,
        phase: data.phase,
        startTime: data.startTime,
        status: MatchStatus.SCHEDULED,
        homeTeamId: data.homeTeamId,
        awayTeamId: data.awayTeamId,

        // Só adiciona se existir (NUNCA undefined explícito)
        ...(data.groupId && { groupId: data.groupId }),
        ...(data.roundId && { roundId: data.roundId }),
      },
    });
  }

  async list(filters: {
    competitionId: string;
    groupId?: string;
    roundId?: string;
  }) {
    return prisma.match.findMany({
      where: {
        competitionId: filters.competitionId,
        ...(filters.groupId && { groupId: filters.groupId }),
        ...(filters.roundId && { roundId: filters.roundId }),
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }

  async findById(id: string) {
    return prisma.match.findUnique({
      where: { id },
    });
  }
}
