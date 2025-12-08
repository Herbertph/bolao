import { Header } from "../components/Header";
import { EmailForm } from "../components/EmailForm";
import { useLang } from "../context/LanguageContext";

export const LandingPage = () => {
  const { t } = useLang();

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-center"
      style={{
        backgroundImage: "url('/background-football.jpg')",
        backgroundPosition: "right center",
      }}
    >
      <Header />

      {/* Overlay para leitura */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Conteúdo */}
      <div className="relative text-white max-w-2xl px-8 md:ml-16">
        
        <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
          {t.title}
        </h1>

        <p className="mt-4 text-lg max-w-lg drop-shadow">
          {t.subtitle}
        </p>

        <div className="mt-8">
          <EmailForm />
        </div>
      </div>
    </div>
  );
};
