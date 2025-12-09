import { useState } from "react";
import { useLang } from "../context/LanguageContext";

export const EmailForm = () => {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateEmail(email)) {
      setMessage(t.error);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage(t.success);
        setEmail("");
      } else {
        const data = await res.json();
        setMessage(data.error || "Erro ao cadastrar.");
      }
    } catch (err) {
      setMessage("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center relative">
      <input
        type="email"
        placeholder={t.placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-3 rounded w-72 bg-white text-black shadow"
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className={`px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? t.loading : t.button}
      </button>

      {message && (
        <p className="absolute -bottom-6 left-0 text-white text-sm">
          {message}
        </p>
      )}
    </form>
  );
};
