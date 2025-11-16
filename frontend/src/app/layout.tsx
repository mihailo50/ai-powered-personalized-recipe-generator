import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { ThemeRegistry } from "@/components/ThemeRegistry";
import { SupabaseProvider } from "@/components/providers/SupabaseProvider";
import { Navbar } from "@/components/Navbar";

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
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
      <body className={roboto.variable}>
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
      </body>
    </html>
  );
}
