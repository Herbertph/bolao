import { Router } from "express";
import { GroupController } from "./group.controller.js";

const router = Router();
const controller = new GroupController();

router.post("/", controller.create.bind(controller));
router.get("/", controller.list.bind(controller));

export default router;