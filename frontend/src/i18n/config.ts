"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enTranslations from "./locales/en.json";
import srTranslations from "./locales/sr.json";
import esTranslations from "./locales/es.json";
import frTranslations from "./locales/fr.json";
import deTranslations from "./locales/de.json";
import itTranslations from "./locales/it.json";
import ptTranslations from "./locales/pt.json";
import ruTranslations from "./locales/ru.json";
import zhTranslations from "./locales/zh.json";
import jaTranslations from "./locales/ja.json";
import koTranslations from "./locales/ko.json";

const resources = {
  en: { translation: enTranslations },
  sr: { translation: srTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
  de: { translation: deTranslations },
  it: { translation: itTranslations },
  pt: { translation: ptTranslations },
  ru: { translation: ruTranslations },
  zh: { translation: zhTranslations },
  ja: { translation: jaTranslations },
  ko: { translation: koTranslations },
};

if (!i18n.isInitialized) {
  // Auto-detect locale from browser or localStorage
  function detectLocale(): string {
    if (typeof window === "undefined") return "en";
    
    // Check localStorage first (user preference)
    const savedLang = localStorage.getItem("language");
    const supportedLanguages = ["en", "sr", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko"];
    if (savedLang && supportedLanguages.includes(savedLang)) {
      return savedLang;
    }
    
    // Auto-detect from browser
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang) {
      const langCode = browserLang.toLowerCase().split("-")[0];
      
      // Map browser language codes to supported languages
      const langMap: Record<string, string> = {
        "en": "en",
        "sr": "sr",
        "es": "es",
        "fr": "fr",
        "de": "de",
        "it": "it",
        "pt": "pt",
        "ru": "ru",
        "zh": "zh",
        "ja": "ja",
        "ko": "ko",
      };
      
      if (langMap[langCode]) {
        return langMap[langCode];
      }
      
      // Check for Serbian country code (RS)
      if (browserLang.includes("RS") || browserLang.includes("rs")) {
        return "sr";
      }
    }
    
    // Default to English
    return "en";
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: detectLocale(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;

