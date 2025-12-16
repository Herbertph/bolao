import { Audit } from "../models/Audit";

export class AuditService {
  async record(data: any) {
    return await Audit.create(data);
  }

  async getAll() {
    return await Audit.find().sort({ createdAt: -1 }).limit(200);
  }
}
