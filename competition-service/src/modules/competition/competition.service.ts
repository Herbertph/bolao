import { prisma } from "../../lib/prisma.js";

export class CompetitionService {
  async create(name: string, signupDeadline: Date) {
    return prisma.competition.create({
      data: {
        name,
        signupDeadline,
      },
    });
  }

  async list() {
    return prisma.competition.findMany();
  }

  async findById(id: string) {
    return prisma.competition.findUnique({
      where: { id },
    });
  }
}
