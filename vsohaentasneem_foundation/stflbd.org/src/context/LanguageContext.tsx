"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "bn" | "en";

export interface BilingualText {
  bn: string;
  en: string;
}

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (content: BilingualText | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "stfl_language_preference";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === "bn" || saved === "en") {
        setLangState(saved);
      }
    } catch {
      // localStorage unavailable or restricted
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === "bn" ? "en" : "bn");
  };

  const t = (content: BilingualText | string): string => {
    if (typeof content === "string") return content;
    if (!content) return "";
    return content[lang] || content.en || content.bn || "";
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      lang: "bn",
      setLang: () => {},
      toggleLang: () => {},
      t: (content: BilingualText | string) => {
        if (typeof content === "string") return content;
        return content.bn || content.en || "";
      },
    };
  }
  return context;
}
