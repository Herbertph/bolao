import { Router } from "express";
import { PredictionsController } from "./predictions.controller.js";

const router = Router();
const controller = new PredictionsController();

router.post("/", (req, res) => controller.create(req, res));
router.get("/", (req, res) => {
  if (req.query.matchId) {
    return controller.listByMatch(req, res);
  }

  if (req.query.userId) {
    return controller.listByUser(req, res);
  }

  return res.status(400).json({
    message: "userId or matchId is required",
  });
});

router.post("/lock/:matchId", (req, res) =>
  controller.lock(req, res)
);

export default router;
