import { Request, Response } from "express";
import { AuditService } from "../services/audit.service";

const service = new AuditService();

export class AuditController {
  async record(req: Request, res: Response) {
    try {
      const audit = await service.record(req.body);
      return res.status(201).json(audit);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    const audits = await service.getAll();
    return res.json(audits);
  }
}
