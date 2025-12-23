import { Router } from "express";
import { MatchesController } from "./matches.controller.js";

const router = Router();
const controller = new MatchesController();

router.post("/", (req, res) => controller.create(req, res));
router.get("/", (req, res) => controller.list(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));

export default router;
