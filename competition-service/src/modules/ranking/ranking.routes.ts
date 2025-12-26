import { Router } from "express";
import { RankingController } from "./ranking.controller.js";

const router = Router();
const controller = new RankingController();

/**
 * GET /ranking?competitionId=xxx
 */
router.get("/", (req, res) =>
  controller.getByCompetition(req, res)
);

export default router;
