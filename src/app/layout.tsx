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
  title: "Kemp OFS Ústí - Fotbalové kempy",
  description: "Fotbalové kempy OFS Ústí nad Labem - Profesionální tréninky, zábava a sport pro děti.",
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
