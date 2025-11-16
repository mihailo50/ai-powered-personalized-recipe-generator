export type Lang = "en" | "sr";

export const dictionary: Record<Lang, Record<string, string>> = {
  en: {
    welcome: "Welcome back, chef",
    startPlanning: "Start planning meals",
    goDashboard: "Go to dashboard",
    savedRecipes: "Saved recipes",
    recentSearches: "Recent searches",
    profile: "Profile",
    logout: "Logout",
  },
  sr: {
    welcome: "Dobrodošao nazad, kuvare",
    startPlanning: "Započni planiranje obroka",
    goDashboard: "Idi na kontrolnu tablu",
    savedRecipes: "Sačuvani recepti",
    recentSearches: "Skorašnje pretrage",
    profile: "Profil",
    logout: "Odjava",
  },
};


