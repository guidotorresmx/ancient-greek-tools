import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { LanguageProvider } from "@/components/language-provider";
import { GameProvider } from "@/components/game-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ancient Greek Tools",
  description:
    "Modern tools for classical philology and learning Ancient Greek.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <GameProvider>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
              {children}
            </main>
          </GameProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
