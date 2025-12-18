import { Router } from "express";
import { TeamController } from "./teams.controller.js";

const router = Router();
const controller = new TeamController();

// Create team (admin-only in the future)
router.post("/", controller.create.bind(controller));

// List all teams or teams by group
router.get("/", controller.list.bind(controller));

// Get team by ID
router.get("/:id", controller.get.bind(controller));

export default router;
