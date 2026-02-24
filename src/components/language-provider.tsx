"use client";

import * as React from "react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../locales/en.json";
import esMessages from "../locales/es.json";

type Locale = "en" | "es";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState<Locale>("en");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("app-locale");
    if (stored === "en" || stored === "es") {
      setLocale(stored);
    }
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem("app-locale", locale);
    }
  }, [locale, mounted]);

  const messages = locale === "en" ? enMessages : esMessages;

  // Prevent hydration mismatch by only rendering child content once mounted
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ locale, setLocale }}>
        <NextIntlClientProvider locale="en" messages={enMessages as any}>
          <div style={{ visibility: "hidden" }}>{children}</div>
        </NextIntlClientProvider>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages as any}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
