"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        welcome: "Welcome back, {{name}}",
        welcomeChef: "Welcome back, chef",
        home: "Home",
        profile: "Profile",
        logout: "Logout",
        language: "Language",
        darkMode: "Dark Mode",
        lightMode: "Light Mode",
        signIn: "Sign in",
        signUp: "Sign up",
        createAccount: "Create one",
        needAccount: "Need an account?",
        forgotPassword: "Forgot your password?",
        terms: "Terms",
        privacy: "Privacy",
        copyright: "© 2025 AI Recipe Studio",
      },
      login: {
        title: "Sign in to personalize your kitchen",
        subtitle: "Save your preferences, generate recipes on demand, and build smarter shopping lists—powered by AI and your pantry.",
        email: "Email",
        password: "Password",
        emailPlaceholder: "you@example.com",
        passwordPlaceholder: "Enter your password",
        signingIn: "Signing in…",
        continueWithGoogle: "Continue with Google",
        connecting: "Connecting…",
      },
      dashboard: {
        greeting: "Generate a new recipe, revisit saved ideas, or refine your preferences.",
        planMeal: "Plan tonight's meal",
        planMealSubtitle: "Feed us your pantry list and preferences. We'll craft a complete recipe, nutrition snapshot, and shopping cues.",
        ingredients: "Ingredients on hand",
        ingredientsPlaceholder: "e.g. tofu, chickpeas, baby spinach",
        ingredientsHelper: "Comma-separated list",
        dietPreferences: "Diet preferences",
        dietPlaceholder: "Tap to pick or type (e.g. vegan)",
        dietHelper: "Choose from suggestions or write your own",
        servings: "Servings",
        servingsPlaceholder: "2",
        notes: "Notes",
        notesPlaceholder: "e.g. Prefer something under 30 minutes with a citrus note",
        notesHelper: "Any cravings or constraints?",
        generateRecipe: "Generate Recipe",
        thinking: "Thinking...",
        crafting: "Crafting your personalized recipe…",
        recentSearches: "Recent searches",
        savedRecipes: "Saved recipes",
      },
    },
  },
  sr: {
    translation: {
      common: {
        welcome: "Dobrodošao nazad, {{name}}",
        welcomeChef: "Dobrodošao nazad, kuvare",
        home: "Početna",
        profile: "Profil",
        logout: "Odjava",
        language: "Jezik",
        darkMode: "Tamni režim",
        lightMode: "Svetli režim",
        signIn: "Prijavi se",
        signUp: "Registruj se",
        createAccount: "Kreiraj nalog",
        needAccount: "Treba ti nalog?",
        forgotPassword: "Zaboravio si lozinku?",
        terms: "Uslovi",
        privacy: "Privatnost",
        copyright: "© 2025 AI Recipe Studio",
      },
      login: {
        title: "Prijavite se da personalizujete svoju kuhinju",
        subtitle: "Sačuvajte svoje preference, generišite recepte na zahtev i napravite pametnije liste za kupovinu—pokretano AI-jem i vašom ostavom.",
        email: "Email",
        password: "Lozinka",
        emailPlaceholder: "vi@primer.com",
        passwordPlaceholder: "Unesite lozinku",
        signingIn: "Prijavljivanje…",
        continueWithGoogle: "Nastavi sa Google-om",
        connecting: "Povezivanje…",
      },
      dashboard: {
        greeting: "Generišite novi recept, pregledajte sačuvane ideje ili prilagodite svoje preference.",
        planMeal: "Planiraj večerašnji obrok",
        planMealSubtitle: "Dajte nam listu iz vaše ostave i preference. Napravićemo kompletan recept, pregled nutritivnih vrednosti i savete za kupovinu.",
        ingredients: "Sastojci koje imate",
        ingredientsPlaceholder: "npr. tofu, slanutak, mladi špinat",
        ingredientsHelper: "Lista odvojena zarezima",
        dietPreferences: "Dijetne preference",
        dietPlaceholder: "Dodirnite da izaberete ili ukucajte (npr. vegan)",
        dietHelper: "Izaberite iz predloga ili napišite svoje",
        servings: "Porcije",
        servingsPlaceholder: "2",
        notes: "Napomene",
        notesPlaceholder: "npr. Preferiram nešto ispod 30 minuta sa citrusnim notama",
        notesHelper: "Ima li želja ili ograničenja?",
        generateRecipe: "Generiši Recept",
        thinking: "Razmišljam...",
        crafting: "Kreiram vaš personalizovani recept…",
        recentSearches: "Skorašnje pretrage",
        savedRecipes: "Sačuvani recepti",
      },
    },
  },
};

if (!i18n.isInitialized) {
  // Auto-detect locale from browser or localStorage
  function detectLocale(): string {
    if (typeof window === "undefined") return "en";
    
    // Check localStorage first (user preference)
    const savedLang = localStorage.getItem("language");
    if (savedLang && (savedLang === "en" || savedLang === "sr")) {
      return savedLang;
    }
    
    // Auto-detect from browser
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang) {
      // Check for Serbian (sr, sr-RS, sr-Latn, etc.)
      if (browserLang.toLowerCase().startsWith("sr")) {
        return "sr";
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

