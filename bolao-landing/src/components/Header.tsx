import { useLang } from "../context/LanguageContext";

export const Header = () => {
  const { lang, switchLang } = useLang();

  return (
    <header className="absolute top-0 left-0 w-full z-20 px-10 py-4 bg-black/20 backdrop-blur-sm border-b border-white/10 flex items-center justify-end">
  <button
    onClick={switchLang}
    className="px-3 py-1 text-white/80 hover:text-white border border-white/40 rounded-md backdrop-blur bg-black/30 hover:bg-black/40 transition"
  >
    {lang === "pt" ? "EN" : "PT"}
  </button>
</header>
  );
};
