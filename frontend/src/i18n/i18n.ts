"use client";

export { default } from "./config";

export type Lang = "en" | "sr";

export const languages: Lang[] = ["en", "sr"];

export const languageNames: Record<Lang, string> = {
  en: "English",
  sr: "Srpski",
};
