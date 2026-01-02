import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google"; // Import modern geometric fonts
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kemp OFS Ústí - Fotbalové kempy pro budoucí hvězdy",
  description: "Připojte se k nám na letní fotbalové kempy v Ústí nad Labem. Rozvoj talentu, zábava a profesionální trenéři.",
  icons: {
    icon: [
      { url: '/main-logo.jpeg' },
      { url: '/main-logo.jpeg', type: 'image/jpeg' },
    ],
    shortcut: ['/main-logo.jpeg'],
    apple: [
      { url: '/main-logo.jpeg' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
