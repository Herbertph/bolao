import { Request, Response } from "express";
import { AuthService } from "../services/auth.services.js";
import { User } from "../models/User.js";
const service = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await service.register(req.body);
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await service.login(
        req.body.emailOrUsername,
        req.body.password
      );
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async me(req: any, res: any) {
    try {
      const user = await User.findById(req.user.id).select("-passwordHash");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      return res.json({ user });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
