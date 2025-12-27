import { Router } from "express";
import { AdminMatchesController } from "./admin.matches.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorizeAdmin } from "../../middleware/authorize.middleware.js";

const router = Router();
const controller = new AdminMatchesController();

/**
 * PATCH /admin/matches/:id
 * ADMIN ONLY
 */
router.patch(
  "/:id",
  authenticate,
  authorizeAdmin,
  (req, res) => controller.finishMatch(req, res)
);

export default router;
