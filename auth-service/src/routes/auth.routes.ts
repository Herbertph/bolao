import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema } from "../validators/register.schema";
import { loginSchema } from "../validators/login.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { rateLimitEmail, rateLimitLogin } from "../middlewares/rateLimit.middleware";

const router = Router();
const controller = new AuthController();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.get("/me", authMiddleware, controller.me);
router.post("/refresh", controller.refresh);
router.post("/logout", authMiddleware, controller.logout);
router.post("/forgot-password", rateLimitEmail(), controller.forgotPassword);
router.post("/reset-password/:token", controller.resetPassword);
router.post("/rate-limit-login", rateLimitLogin(5, 60), controller.login);


export default router;
