import type { Request, Response } from "express";
import { TeamService } from "./teams.service.js";

const service = new TeamService();

export class TeamController {
  async create(req: Request, res: Response) {
    const { name, fifaCode, groupId } = req.body;

    if (!name || !fifaCode || !groupId) {
      return res.status(400).json({
        message: "name, fifaCode and groupId are required",
      });
    }

    const team = await service.create({
      name,
      fifaCode,
      groupId,
    });

    return res.status(201).json(team);
  }

  async list(req: Request, res: Response) {
    const { groupId } = req.query;

    if (groupId) {
      const teams = await service.getByGroup(groupId.toString());
      return res.json(teams);
    }

    const teams = await service.getAll();
    return res.json(teams);
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({
        message: "Team id is required",
      });
    }
  
    const team = await service.getById(id);
  
    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }
  
    return res.json(team);
  }
}
