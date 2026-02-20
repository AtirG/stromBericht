import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Strombericht - Stromverbrauch Analyse & Lastgang Einblicke",
  description: "Analysieren Sie Ihren Lastgang einfach und schnell mit Strombericht. Laden Sie Ihre Daten hoch und erhalten Sie sofortige Einblicke in Ihren Stromverbrauch.",
};

import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import Header from "@/components/layout/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeSwitcher>
          <Header />
          {children}
        </ThemeSwitcher>
      </body>
    </html>
  );
}
