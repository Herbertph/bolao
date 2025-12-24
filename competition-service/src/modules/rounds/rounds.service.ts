import { prisma } from "../../lib/prisma.js";

export class RoundsService {
  async create(groupId: string, roundNumber: number) {
    return prisma.round.create({
      data: {
        groupId,
        roundNumber,
      },
    });
  }

  async listByGroup(groupId: string) {
    return prisma.round.findMany({
      where: { groupId },
      orderBy: { roundNumber: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.round.findUnique({
      where: { id },
    });
  }
}
