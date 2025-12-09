import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const email = body?.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Somente enviar email — sem contatos!
    await resend.emails.send({
      from: "Bolão da Copa <onboarding@resend.dev>",
      to: email,
      subject: "Bem-vindo ao Bolão da Copa!",
      html: "<p>Obrigado por se inscrever!</p>",
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("FUNCTION ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
