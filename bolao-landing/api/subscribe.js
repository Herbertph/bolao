import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // 👇 Apenas envia o e-mail — nada de contacts.create()
    await resend.emails.send({
      from: "Bolão da Copa <onboarding@resend.dev>",
      to: email,
      subject: "Bem-vindo ao Bolão da Copa!",
      html: `
        <h2>Bem-vindo ao Bolão da Copa! ⚽</h2>
        <p>Você entrou na nossa lista VIP — obrigado!</p>
        <p>Em breve enviaremos novidades exclusivas.</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: error?.message || "Unknown error" });
  }
}
