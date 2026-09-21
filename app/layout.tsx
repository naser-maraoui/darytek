import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/store/CartProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Use env var on Vercel, fallback to localhost for dev
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // ── Basic ────────────────────────────────────────
  title: {
    default: "Darytek — Votre boutique d'électroménager et accessoires",
    template: "%s | Darytek",
  },
  description:
    "Darytek, votre boutique d'électroménager en Tunisie. Réfrigérateurs, machines à laver, climatiseurs et plus — livraison rapide, paiement à la livraison, produits garantis.",

  keywords: [
    "électroménager Tunisie",
    "Darytek",
    "réfrigérateur Tunisie",
    "machine à laver Tunisie",
    "climatiseur Tunisie",
    "électroménager pas cher",
    "livraison Tunisie",
    "paiement à la livraison",
  ],

  authors: [{ name: "Darytek" }],
  creator: "Darytek",
  publisher: "Darytek",

 

  // ── Open Graph (WhatsApp / Facebook link previews) ──
  openGraph: {
    type: "website",
    locale: "fr_TN",
    url: siteUrl,
    siteName: "Darytek",
    title: "Darytek — Électroménager en Tunisie",
    description:
      "Réfrigérateurs, machines à laver, climatiseurs et plus — livrés partout en Tunisie. Paiement à la livraison.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Darytek — Électroménager en Tunisie",
      },
    ],
  },

  // ── Twitter ──────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Darytek — Électroménager en Tunisie",
    description:
      "Réfrigérateurs, machines à laver, climatiseurs et plus — livrés partout en Tunisie.",
    images: ["/logo.png"],
  },

  // ── SEO ──────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="fr" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}