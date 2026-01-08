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
  metadataBase: new URL('https://www.kempofsusti.cz'),
  title: {
    default: "Kemp OFS Ústí | Fotbalové kempy pro budoucí hvězdy",
    template: "%s | Kemp OFS Ústí",
  },
  description: "Připojte se k nám na letní fotbalové kempy v Ústí nad Labem. Profesionální trenéři, rozvoj fotbalového talentu, zábava a nezapomenutelné zážitky pro děti.",
  keywords: ["fotbalový kemp", "fotbal", "ústí nad labem", "dětský tábor", "sportovní kemp", "letní kemp", "OFS Ústí", "trénink dětí"],
  authors: [{ name: "OFS Ústí" }],
  creator: "OFS Ústí",
  publisher: "OFS Ústí",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
  openGraph: {
    title: "Kemp OFS Ústí - Fotbalové kempy pro budoucí hvězdy",
    description: "Profesionální fotbalové kempy v Ústí nad Labem. Dejte svým dětem šanci zlepšit se pod vedením zkušených trenérů.",
    url: 'https://www.kempofsusti.cz',
    siteName: 'Kemp OFS Ústí',
    images: [
      {
        url: '/main-logo.jpeg', // You might want to create a specific OG image later, using logo for now
        width: 800,
        height: 800,
        alt: 'Kemp OFS Ústí Logo',
      },
    ],
    locale: 'cs_CZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Kemp OFS Ústí",
    description: "Letní fotbalové kempy v Ústí nad Labem. Rozvoj talentu a zábava.",
    images: ['/main-logo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: 'Kemp OFS Ústí',
  url: 'https://www.kempofsusti.cz',
  logo: 'https://www.kempofsusti.cz/main-logo.jpeg',
  description: 'Organizátor fotbalových kempů pro děti v Ústí nad Labem.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ústí nad Labem',
    addressCountry: 'CZ',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+420 603 985 226',
    contactType: 'customer support',
  },
  sameAs: [
    'https://www.facebook.com/kempofsul?locale=cs_CZ',
    'https://www.instagram.com/kempofsul/',
    'mailto:kempofsusti@seznam.cz',
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
