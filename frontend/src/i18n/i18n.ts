"use client";

export { default } from "./config";

export type Lang = "en" | "sr" | "es" | "fr" | "de" | "it" | "pt" | "ru" | "zh" | "ja" | "ko";

export const languages: Lang[] = ["en", "sr", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko"];

export const languageNames: Record<Lang, string> = {
  en: "English",
  sr: "Srpski",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ru: "Русский",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
};
