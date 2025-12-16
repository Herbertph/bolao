import { Schema, model } from "mongoose";

const AuditEventSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  service: { type: String, required: true },
  eventType: { type: String, required: true },
  userId: { type: String },
  ip: { type: String },
  metadata: { type: Object }
}, { versionKey: false });

export const AuditEvent = model("AuditEvent", AuditEventSchema);
