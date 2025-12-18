import { prisma } from "../../lib/prisma.js";

export class TeamService {
  async create(data: { name: string; fifaCode: string; groupId: string }) {
    return prisma.team.create({ data });
  }

  async getAll() {
    return prisma.team.findMany({
      orderBy: { name: "asc" },
    });
  }

  async getByGroup(groupId: string) {
    return prisma.team.findMany({
      where: { groupId },
      orderBy: { name: "asc" },
    });
  }

  async getById(id: string) {
    return prisma.team.findUnique({
      where: { id },
    });
  }
}
