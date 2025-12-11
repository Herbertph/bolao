import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validators/register.schema.js";
import { loginSchema } from "../validators/login.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const controller = new AuthController();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.get("/me", authMiddleware, controller.me);
router.post("/refresh", controller.refresh);
router.post("/logout", authMiddleware, controller.logout);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password/:token", controller.resetPassword);

export default router;
