import { useLang } from "../context/LanguageContext";

export const LanguageSwitcher = () => {
  const { lang, switchLang } = useLang();

  return (
    <button
      onClick={switchLang}
      className="absolute top-4 right-4 px-3 py-1 rounded bg-white/20 text-white border border-white/40 backdrop-blur hover:bg-white/30 transition"
    >
      {lang === "pt" ? "EN" : "PT"}
    </button>
  );
};
