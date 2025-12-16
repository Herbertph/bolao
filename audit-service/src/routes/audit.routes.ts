import { Router } from "express";
import { AuditController } from "../controllers/audit.controller";

const router = Router();
const controller = new AuditController();

router.post("/", controller.record);
router.get("/", controller.list);

export default router;
