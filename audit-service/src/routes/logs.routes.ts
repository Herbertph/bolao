import { Router } from "express";
import { AuditEvent } from "../models/AuditEvents";

const router = Router();

// Endpoint para receber logs
router.post("/", async (req, res) => {
  try {
    const event = await AuditEvent.create(req.body);
    return res.status(201).json({ success: true, event });
  } catch (err) {
    console.error("AUDIT_ERROR:", err);
    return res.status(400).json({ error: "Failed to log event" });
  }
});

export default router;
