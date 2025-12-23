import type { Request, Response } from "express";
import { CompetitionService } from "./competition.service.js";

const service = new CompetitionService();

export class CompetitionController {
  async create(req: Request, res: Response) {
    try {
      const { name, signupDeadline } = req.body;

      if (!name || !signupDeadline) {
        return res.status(400).json({
          message: "name and signupDeadline are required",
        });
      }

      const competition = await service.create(
        name,
        new Date(signupDeadline) // 🔥 ISSO É ESSENCIAL
      );

      return res.status(201).json(competition);
    } catch (error) {
      console.error("CompetitionController.create error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async list(req: Request, res: Response) {
    const competitions = await service.list();
    return res.json(competitions);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const competition = await service.findById(id);

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    return res.json(competition);
  }
}
