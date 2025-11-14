import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";

import { ThemeRegistry } from "@/components/ThemeRegistry";
import { SupabaseProvider } from "@/components/providers/SupabaseProvider";

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
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${geistMono.variable}`}>
        <SupabaseProvider initialSession={null}>
          <ThemeRegistry>{children}</ThemeRegistry>
        </SupabaseProvider>
      </body>
    </html>
  );
}
