import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema({
  service: { type: String, required: true },
  action: { type: String, required: true },
  userId: { type: String, required: false },
  ip: { type: String, required: false },
  metadata: { type: Object, required: false },
  createdAt: { type: Date, default: Date.now }
});

export const Audit = mongoose.model("Audit", AuditSchema);
