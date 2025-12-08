import { useState } from "react";
import { useLang } from "../context/LanguageContext";

export const EmailForm = () => {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setMessage(t.error);
      return;
    }

    setMessage(t.success);
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center">
      <input
        type="email"
        placeholder={t.placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-3 rounded w-72 bg-white text-black shadow"
      />

      <button
        type="submit"
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow transition justify-end"
      >
        {t.button}
      </button>

      {message && (
        <p className="absolute mt-16 text-white">{message}</p>
      )}
    </form>
  );
};
