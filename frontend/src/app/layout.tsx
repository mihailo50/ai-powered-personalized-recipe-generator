import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeRegistry } from "@/components/ThemeRegistry";
import { SupabaseProvider } from "@/components/providers/SupabaseProvider";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/Navbar";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
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
  return (
    <html lang="en">
      <body className={inter.variable} style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}>
        <I18nProvider>
          <ThemeProvider>
            <SupabaseProvider initialSession={null}>
              <ThemeRegistry>
                <Navbar />
                <main style={{ maxWidth: 1200, margin: "0 auto", padding: "20px", minHeight: "calc(100vh - 200px)" }}>
                  {children}
                </main>
                <footer className="footer">
                  <div>
                    © {new Date().getFullYear()} <strong>AI Recipe Studio</strong> |{" "}
                    <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a>
                  </div>
                </footer>
              </ThemeRegistry>
            </SupabaseProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
