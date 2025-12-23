// src/modules/matches/matches.controller.ts
import type { Request, Response } from "express";
import { MatchesService } from "./matches.service.js";
import { Phase } from "@prisma/client";

const service = new MatchesService();

export class MatchesController {
  async create(req: Request, res: Response) {
    try {
      const {
        competitionId,
        phase,
        startTime,
        homeTeamId,
        awayTeamId,
        groupId,
        roundId,
      } = req.body;

      if (
        !competitionId ||
        !phase ||
        !startTime ||
        !homeTeamId ||
        !awayTeamId
      ) {
        return res.status(400).json({
          message:
            "competitionId, phase, startTime, homeTeamId and awayTeamId are required",
        });
      }

      // Validação básica de phase
      if (!Object.values(Phase).includes(phase)) {
        return res.status(400).json({
          message: "Invalid phase value",
        });
      }

      const match = await service.create({
        competitionId,
        phase,
        startTime: new Date(startTime),
        homeTeamId,
        awayTeamId,
        groupId,
        roundId,
      });

      return res.status(201).json(match);
    } catch (error: any) {
      console.error("MatchesController.create error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { competitionId, groupId, roundId } = req.query;
  
      if (!competitionId || typeof competitionId !== "string") {
        return res.status(400).json({
          message: "competitionId is required",
        });
      }
  
      // 👇 CONSTRUÇÃO SEGURA (SEM undefined)
      const filters: { competitionId: string; groupId?: string; roundId?: string } =
        { competitionId };
  
      if (typeof groupId === "string") {
        filters.groupId = groupId;
      }
  
      if (typeof roundId === "string") {
        filters.roundId = roundId;
      }
  
      const matches = await service.list(filters);
  
      return res.json(matches);
    } catch (error) {
      console.error("MatchesController.list error:", error);
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
          message: "Match id is required",
        });
      }

      const match = await service.findById(id);

      if (!match) {
        return res.status(404).json({
          message: "Match not found",
        });
      }

      return res.json(match);
    } catch (error) {
      console.error("MatchesController.getById error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}
