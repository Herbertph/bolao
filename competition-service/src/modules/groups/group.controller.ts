import type { Request, Response } from "express";
import { GroupsService } from "./group.service.js";

const service = new GroupsService();

export class GroupController {
  async create(req: Request, res: Response) {
    const { name, competitionId } = req.body;

    if (!name || !competitionId) {
      return res.status(400).json({
        message: "name and competitionId are required",
      });
    }

    const group = await service.create(name, competitionId);

    return res.status(201).json(group);
  }

  async list(req: Request, res: Response) {
    const groups = await service.list();
    return res.status(200).json(groups);
  }
}
