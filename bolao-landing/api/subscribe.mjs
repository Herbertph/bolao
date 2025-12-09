import { Resend } from "resend";

export default async function handler(req, res) {
  console.log(">>> FUNCTION STARTED");

  if (req.method !== "POST") {
    console.log(">>> WRONG METHOD");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log(">>> RAW BODY:", req.body);

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    console.log(">>> PARSED BODY:", body);

    const email = body?.email;

    console.log(">>> EMAIL:", email);

    if (!email) {
      console.log(">>> EMAIL MISSING");
      return res.status(400).json({ error: "Email is required" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log(">>> SENDING EMAIL...");

    const result = await resend.emails.send({
      from: "Bolao <onboarding@resend.dev>",
      to: email,
      subject: "Bem-vindo!",
      html: "<p>Obrigado por se inscrever!</p>",
    });

    console.log(">>> SEND RESULT:", result);

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(">>> ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
