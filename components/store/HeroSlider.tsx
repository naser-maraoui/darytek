"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  theme: "navy" | "orange" | "dark" | "green";
};

const slides: Slide[] = [
  {
    id: 1,
    badge: "⚡ Nouveautés 2025",
    title: "Équipez votre maison au meilleur prix",
    subtitle:
      "Réfrigérateurs, machines à laver, climatiseurs — livrés partout en Tunisie.",
    ctaText: "Découvrir nos produits",
    ctaHref: "/products",
    image:
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&q=80",
    theme: "navy",
  },
  {
    id: 2,
    badge: "🔥 Promotions",
    title: "Jusqu'à -40% sur une sélection",
    subtitle:
      "Profitez de nos offres limitées sur l'électroménager et le petit équipement.",
    ctaText: "Voir les offres",
    ctaHref: "/products?promo=1",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80",
    theme: "orange",
  },
  {
    id: 3,
    badge: "💳 Paiement à la livraison",
    title: "Commandez sans avancer un dinar",
    subtitle:
      "Payez à la réception de votre commande, partout en Tunisie.",
    ctaText: "Commander maintenant",
    ctaHref: "/products",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    theme: "dark",
  },
];

const themes = {
  navy: "from-navy-800 via-navy-700 to-navy-900",
  orange: "from-orange-500 via-orange-600 to-red-600",
  dark: "from-gray-900 via-gray-800 to-navy-900",
  green: "from-green-600 via-green-500 to-emerald-600",
};

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className={`relative bg-gradient-to-br ${themes[slide.theme]} transition-all duration-700`}
      >
        <div className="relative grid min-h-[340px] items-center gap-8 px-6 py-10 sm:min-h-[400px] sm:px-10 sm:py-14 lg:min-h-[440px] lg:grid-cols-2 lg:px-16">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold text-white backdrop-blur">
              {slide.badge}
            </span>
            <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/85 sm:text-base">
              {slide.subtitle}
            </p>
            <Link
              href={slide.ctaHref}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/30 transition hover:scale-105 hover:bg-orange-400 hover:shadow-xl"
            >
              {slide.ctaText}
              <span>→</span>
            </Link>
          </div>

          <div className="relative hidden h-[300px] lg:block lg:h-[360px]">
            <Image
              key={slide.id}
              src={slide.image}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 0px, 600px"
              className="rounded-2xl object-cover shadow-2xl"
            />
          </div>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-white/5" />
      </div>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          setCurrent((c) => (c - 1 + slides.length) % slides.length)
        }
        aria-label="Previous"
        className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40 md:flex"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        aria-label="Next"
        className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40 md:flex"
      >
        ›
      </button>
    </div>
  );
}