import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";

import { ThemeRegistry } from "@/components/ThemeRegistry";
import { SupabaseProvider } from "@/components/providers/SupabaseProvider";
import { dictionary, type Lang } from "@/i18n/i18n";

import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Recipe Studio",
  description:
    "Personalized recipe generation powered by AI with nutrition insights and smart recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = (typeof window === "undefined"
    ? "en"
    : ((localStorage.getItem("lang") as Lang) || "en")) as Lang;
  const t = (key: string) => dictionary[lang][key] ?? key;

  return (
    <html lang={lang}>
      <body className={`${montserrat.variable} ${geistMono.variable}`}>
        <div className="app-nav">
          <div className="bar">
            <a className="nav-link" href="/dashboard">AI Recipe Studio</a>
            <div className="nav-actions">
              <a className="nav-btn" href="/dashboard">Home</a>
              <a className="nav-btn" href="/profile">Profile</a>
              <a className="nav-btn" href="/login">Logout</a>
              <a className="info-icon" href="/" title="Marketing site">i</a>
            </div>
          </div>
        </div>
        <SupabaseProvider initialSession={null}>
          <ThemeRegistry>
            <main style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>{children}</main>
            <footer className="footer">
              <div>© {new Date().getFullYear()} <strong>AI Recipe Studio</strong> · <a className="nav-link" href="/terms">Terms</a> · <a className="nav-link" href="/privacy">Privacy</a></div>
            </footer>
          </ThemeRegistry>
        </SupabaseProvider>
      </body>
    </html>
  );
}
