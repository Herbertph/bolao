import type { Request, Response } from "express";
import { PredictionsService } from "./predictions.service.js";
import { AuthRequest } from "../../middleware/auth.middleware.js";

const service = new PredictionsService();

export class PredictionsController {
  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id; 
      const {
        matchId,
        predictedHomeScore,
        predictedAwayScore,
      } = req.body;

      if (
        !userId ||
        !matchId ||
        predictedHomeScore === undefined ||
        predictedAwayScore === undefined
      ) {
        return res.status(400).json({
          message:
            "matchId, predictedHomeScore and predictedAwayScore are required",
        });
      }

      const prediction = await service.createOrUpdate({
        userId,
        matchId,
        predictedHomeScore,
        predictedAwayScore,
      });

      return res.status(201).json(prediction);
    } catch (error: any) {
      if (error.message === "PREDICTION_LOCKED") {
        return res.status(423).json({
          message: "Prediction is locked and cannot be updated",
        });
      }

      console.error("PredictionsController.create error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async listMe(req: AuthRequest, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const predictions = await service.listByUser(userId);
    return res.json(predictions);
  }

  async listByMatch(req: Request, res: Response) {
    const { matchId } = req.query;

    if (!matchId || typeof matchId !== "string") {
      return res.status(400).json({
        message: "matchId is required",
      });
    }

    const predictions = await service.listByMatch(matchId);
    return res.json(predictions);
  }
}
