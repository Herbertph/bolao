import { Router } from "express";
import { ScoringController } from "./scoring.controller.js";

const router = Router();
const controller = new ScoringController();

/**
 * POST /admin/score/:matchId
 */
router.post("/:matchId", (req, res) =>
  controller.scoreMatch(req, res)
);

/**
 * POST /admin/score
 * usado apenas para retornar erro explícito
 */
router.post("/", (_req, res) => {
  return res.status(400).json({
    message: "matchId is required",
  });
});

export default router;
