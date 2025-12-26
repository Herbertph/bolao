import { Router } from "express";
import { AdminMatchesController } from "./admin.matches.controller.js";

const router = Router();
const controller = new AdminMatchesController();

// PATCH (REST correto)
router.patch("/:id", (req, res) => {
  return controller.finishMatch(req, res);
});

// POST (compatibilidade com testes / automação)
router.post("/:id", (req, res) => {
  return controller.finishMatch(req, res);
});

// Opcional, semântico
router.patch("/:id/finish", (req, res) => {
  return controller.finishMatch(req, res);
});

router.post("/:id/finish", (req, res) => {
  return controller.finishMatch(req, res);
});

export default router;
