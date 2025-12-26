import type { Request, Response } from "express";
import { RankingService } from "./ranking.service.js";

const service = new RankingService();

export class RankingController {
  async getByCompetition(req: Request, res: Response) {
    const { competitionId } = req.query;

    if (!competitionId || typeof competitionId !== "string") {
      return res.status(400).json({
        message: "competitionId is required",
      });
    }

    const ranking = await service.getByCompetition(competitionId);

    return res.json(ranking);
  }
}
