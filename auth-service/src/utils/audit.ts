import axios from "axios";

const AUDIT_URL = process.env.AUDIT_URL || "http://audit-service:5003/audit";

export async function audit(event: any) {
  try {
    await axios.post(AUDIT_URL, event);
  } catch (err) {
    console.error("AUDIT FAILED:", (err as any).message);
  }
}
