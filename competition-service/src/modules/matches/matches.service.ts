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

interface ListMatchesFilters {
  competitionId?: string;
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

        ...(data.groupId && { groupId: data.groupId }),
        ...(data.roundId && { roundId: data.roundId }),
      },
    });
  }

  async list(filters: ListMatchesFilters = {}) {
    return prisma.match.findMany({
      where: {
        ...(filters.competitionId && { competitionId: filters.competitionId }),
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

  async finishMatch(matchId: string, homeScore: number, awayScore: number) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });
  
    if (!match) {
      throw new Error("MATCH_NOT_FOUND");
    }
  
    if (match.status === "FINISHED") {
      throw new Error("MATCH_ALREADY_FINISHED");
    }
  
    return prisma.match.update({
      where: { id: matchId },
      data: {
        homeScore,
        awayScore,
        status: "FINISHED",
      },
    });
  }
}