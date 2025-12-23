import { Router } from "express";
import { CompetitionController } from "./competition.controller.js";

const router = Router();
const controller = new CompetitionController();

router.post("/", (req, res) => controller.create(req, res));
router.get("/", (req, res) => controller.list(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));

export default router;
