import { createContext, useContext, useState } from "react";
import pt from "../locales/pt.json";
import en from "../locales/en.json";

type Lang = "pt" | "en";

const dictionaries = { pt, en };

interface LangContextType {
  lang: Lang;
  t: typeof pt;
  switchLang: () => void;
}

const LanguageContext = createContext<LangContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>("pt");

  const switchLang = () => {
    setLang((prev) => (prev === "pt" ? "en" : "pt"));
  };

  return (
    <LanguageContext.Provider value={{ lang, t: dictionaries[lang], switchLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext)!;
