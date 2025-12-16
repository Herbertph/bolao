import axios from "axios";
import fs from "fs";
import path from "path";

const AUDIT_URL = process.env.AUDIT_SERVICE_URL || "http://audit-service:4002/audit";

export async function audit(data: any) {
  try {
    await axios.post(AUDIT_URL, data, { timeout: 1500 });
    return true;
  } catch (err) {
    console.error("AUDIT FAILED (1st attempt)");

    // Retry 2 more times
    for (let i = 0; i < 2; i++) {
      try {
        await axios.post(AUDIT_URL, data, { timeout: 1500 });
        console.warn("AUDIT SUCCESS AFTER RETRY");
        return true;
      } catch {}
    }

    console.error("AUDIT FAILED PERMANENTLY. Saving fallback.");

    // Fallback local file
    const file = path.join("/tmp", "audit-fallback.log");
    fs.appendFileSync(file, JSON.stringify({ ts: new Date(), data }) + "\n");

    return false;
  }
}
