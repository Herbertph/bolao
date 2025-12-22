import { prisma } from "../../lib/prisma.js";

export class GroupsService {
  async create(name: string, competitionId: string) {
    return prisma.group.create({
      data: {
        name,
        competition: {
          connect: { id: competitionId },
        },
      },
    });
  }

  async list() {
    return prisma.group.findMany({
      include: {
        competition: true,
      },
    });
  }
}
