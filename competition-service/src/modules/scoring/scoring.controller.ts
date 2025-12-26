import type { Request, Response } from "express";
import { ScoringService } from "./scoring.service.js";

const service = new ScoringService();

export class ScoringController {
  async scoreMatch(req: Request, res: Response) {
    try {
      const { matchId } = req.params;

      if (!matchId) {
        return res.status(400).json({
          message: "matchId is required",
        });
      }

      const result = await service.scoreMatch(matchId);

      return res.status(200).json({
        message: "Match scored successfully",
        ...result,
      });
    } catch (error: any) {
      if (error.message === "MATCH_NOT_FINISHED") {
        return res.status(409).json({
          message: "Match is not finished yet",
        });
      }

      console.error("ScoringController.scoreMatch error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}
