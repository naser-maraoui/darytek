"use client";

import { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image_url: string | null;
  is_available: boolean;
  compare_at_price?: number | null;
  categories: { name: string; slug: string }[] | null;
};

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function ProductCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [products.length]);

  useEffect(() => {
    if (products.length < 2 || isPaused) return;
    const id = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const amount = el.clientWidth * 0.5;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: amount, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(id);
  }, [products.length, isPaused]);

  const pauseTemporarily = () => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 8000);
  };

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.5;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
    pauseTemporarily();
  };

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        disabled={!canScrollLeft}
        aria-label="Précédent"
        className={`absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-lg transition-all md:flex ${
          canScrollLeft
            ? "opacity-100 hover:scale-110 hover:bg-navy-900 hover:text-white"
            : "pointer-events-none opacity-0"
        }`}
        style={{ marginLeft: "-22px" }}
      >
        <ChevronLeft />
      </button>

      <button
        type="button"
        onClick={() => scrollBy(1)}
        disabled={!canScrollRight}
        aria-label="Suivant"
        className={`absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-lg transition-all md:flex ${
          canScrollRight
            ? "opacity-100 hover:scale-110 hover:bg-navy-900 hover:text-white"
            : "pointer-events-none opacity-0"
        }`}
        style={{ marginRight: "-22px" }}
      >
        <ChevronRight />
      </button>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={pauseTemporarily}
        onWheel={pauseTemporarily}
        className="no-scrollbar flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth pb-2 sm:gap-3 lg:gap-4"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="w-[calc(50%-5px)] flex-shrink-0 snap-start sm:w-[calc(33.333%-7px)] md:w-[calc(25%-9px)] lg:w-[calc(20%-10px)] xl:w-[calc(16.666%-12px)]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}