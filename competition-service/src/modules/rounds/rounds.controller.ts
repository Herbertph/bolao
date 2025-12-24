import type { Request, Response } from "express";
import { RoundsService } from "./rounds.service.js";

const service = new RoundsService();

export class RoundsController {
  async create(req: Request, res: Response) {
    try {
      const { groupId, roundNumber } = req.body;

      if (!groupId || typeof roundNumber !== "number") {
        return res.status(400).json({
          message: "groupId and roundNumber are required",
        });
      }

      const round = await service.create(groupId, roundNumber);
      return res.status(201).json(round);
    } catch (error) {
      console.error("RoundsController.create error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { groupId } = req.query;

      if (typeof groupId !== "string") {
        return res.status(400).json({
          message: "groupId is required",
        });
      }

      const rounds = await service.listByGroup(groupId);
      return res.json(rounds);
    } catch (error) {
      console.error("RoundsController.list error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: "Round id is required",
        });
      }

      const round = await service.findById(id);

      if (!round) {
        return res.status(404).json({
          message: "Round not found",
        });
      }

      return res.json(round);
    } catch (error) {
      console.error("RoundsController.getById error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}
