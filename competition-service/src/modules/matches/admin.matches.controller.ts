import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { MatchStatus } from "@prisma/client";

export class AdminMatchesController {
  async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeScore, awayScore } = req.body;

    if (!id) {
      return res.status(400).json({ message: "match id is required" });
    }

    if (homeScore === undefined || awayScore === undefined) {
      return res.status(400).json({
        message: "homeScore and awayScore are required",
      });
    }

    const match = await prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // 🔒 Idempotência
    if (match.status === MatchStatus.FINISHED) {
      return res.status(409).json({
        message: "Match already finished",
      });
    }

    const updated = await prisma.match.update({
      where: { id },
      data: {
        homeScore,
        awayScore,
        status: MatchStatus.FINISHED,
      },
    });

    return res.status(200).json(updated);
  }
}
