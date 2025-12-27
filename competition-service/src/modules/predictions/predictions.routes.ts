import { Router } from "express";
import { PredictionsController } from "./predictions.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();
const controller = new PredictionsController();

// criar / atualizar prediction
router.post(
  "/",
  authenticate,
  (req, res) => controller.create(req, res)
);

// listar minhas predictions
router.get(
  "/me",
  authenticate,
  (req, res) => controller.listMe(req, res)
);

// público — por match
router.get(
  "/",
  (req, res) => controller.listByMatch(req, res)
);

export default router;
