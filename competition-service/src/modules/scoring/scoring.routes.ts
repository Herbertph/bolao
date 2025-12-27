import { Router } from "express";
import { ScoringController } from "./scoring.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorizeAdmin } from "../../middleware/authorize.middleware.js";

const router = Router();
const controller = new ScoringController();

/**
 * POST /admin/score/:matchId
 * ADMIN ONLY
 */
router.post(
  "/:matchId",
  authenticate,
  authorizeAdmin,
  (req, res) => controller.scoreMatch(req, res)
);

/**
 * POST /admin/score
 * erro explícito
 */
router.post("/", (_req, res) => {
  return res.status(400).json({
    message: "matchId is required",
  });
});

export default router;
