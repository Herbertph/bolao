import { Request, Response } from "express";
import { AuthService } from "../services/auth.services.js";

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

  async me(req: any, res: Response) {
    try {
      const user = await service.me(req.user.id);
      return res.json({ user });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: "Missing refresh token" });
      }

      const tokens = await service.refresh(refreshToken);
      return res.json(tokens);
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }

  async logout(req: any, res: Response) {
    try {
      await service.logout(req.user.id);
      return res.json({ message: "Logged out" });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
