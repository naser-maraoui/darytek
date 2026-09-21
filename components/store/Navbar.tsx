"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import Logo from "@/components/brand/Logo";

type Category = {
  id: number;
  name: string;
  slug: string;
};

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

// ---------- Icons ----------
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
function ChevronDown({ rotated = false }: { rotated?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-3.5 w-3.5 transition-transform duration-200 ${rotated ? "rotate-180" : ""}`}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function FireIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

const promoMessages = [
  "🚚 Livraison gratuite dès 300 DT",
  "🔥 Jusqu'à -40% sur une sélection",
  "💳 Paiement à la livraison partout en Tunisie",
  "🎁 Nouveaux arrivages chaque semaine",
  "📞 Service client : 7j/7",
];

export default function Navbar({ categories }: { categories: Category[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [rayonsOpen, setRayonsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();
  const mounted = useIsClient();
  const rayonsRef = useRef<HTMLDivElement>(null);

  const phone = process.env.NEXT_PUBLIC_PHONE ?? "+216 XX XXX XXX";
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mega menu when clicking outside
  useEffect(() => {
    if (!rayonsOpen) return;
    const onClick = (e: MouseEvent) => {
      if (rayonsRef.current && !rayonsRef.current.contains(e.target as Node)) {
        setRayonsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRayonsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [rayonsOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`);
      setMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* ============ PROMO TICKER ============ */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white">
          <div className="flex animate-marquee-slow whitespace-nowrap py-2 text-[12px] font-semibold">
            {[...promoMessages, ...promoMessages].map((msg, i) => (
              <span key={i} className="mx-8 inline-flex items-center gap-1.5">
                {msg}
                <span className="ml-8 text-white/50">•</span>
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-orange-500 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-red-500 to-transparent" />
        </div>

        {/* ============ FLOATING NAVBAR ============ */}
        <div className={`px-3 transition-all duration-300 sm:px-4 ${scrolled ? "pt-2" : "pt-3"}`}>
          <div
            className={`mx-auto max-w-7xl overflow-visible rounded-2xl border bg-white/95 backdrop-blur-xl transition-all duration-300 ${
              scrolled
                ? "border-gray-200/80 shadow-lg shadow-navy-900/5"
                : "border-gray-200/50 shadow-md shadow-navy-900/5"
            }`}
          >
            {/* -------- MAIN ROW -------- */}
            <div
              className={`flex items-center gap-4 transition-all duration-300 sm:gap-6 ${
                scrolled ? "px-4 py-2.5" : "px-4 py-3 sm:px-5 sm:py-3.5"
              }`}
            >
              {/* Logo */}
              <Logo size={scrolled ? "md" : "xl"} />

              {/* Search */}
              <form onSubmit={handleSearch} className="hidden flex-1 md:block" role="search">
                <div className="group flex h-12 overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-50 transition focus-within:border-orange-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-orange-500/10">
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un produit, une marque..."
                    className="flex-1 bg-transparent px-5 text-sm outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    className="m-1 flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 text-sm font-black text-white shadow-md shadow-orange-500/20 transition hover:from-orange-600 hover:to-orange-700"
                  >
                    <SearchIcon />
                    <span className="hidden lg:inline">Rechercher</span>
                  </button>
                </div>
              </form>

              {/* Cart + Menu */}
              <div className="ml-auto flex items-center gap-2">
                <Link
                  href="/cart"
                  className="group relative flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-navy-900 to-navy-800 px-4 text-sm font-bold text-white shadow-md shadow-navy-900/20 transition hover:from-orange-500 hover:to-orange-600 hover:shadow-orange-500/25"
                >
                  <span className="relative">
                    <CartIcon />
                    {mounted && itemCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-black text-orange-500 shadow-md animate-pulse-dot">
                        {itemCount}
                      </span>
                    )}
                  </span>
                  <span className="hidden sm:inline">Panier</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-800 transition hover:bg-gray-100 md:hidden"
                  aria-label="Menu"
                >
                  {menuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>

            {/* -------- NAV ROW (desktop) -------- */}
            <div className="hidden border-t border-gray-100 md:block">
              <div className="flex items-center gap-1 px-3 py-2">
                {/* Tous nos rayons — click toggle */}
                <div className="relative" ref={rayonsRef}>
                  <button
                    type="button"
                    onClick={() => setRayonsOpen((v) => !v)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition ${
                      rayonsOpen
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                        : "bg-navy-900 text-white hover:bg-navy-800"
                    }`}
                  >
                    <MenuIcon />
                    Tous nos rayons
                    <ChevronDown rotated={rayonsOpen} />
                  </button>

                  {rayonsOpen && categories.length > 0 && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                      <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white px-4 py-2.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">
                          Catégories
                        </p>
                      </div>
                      <div className="max-h-96 overflow-y-auto py-2">
                        {categories.map((c) => (
                          <Link
                            key={c.id}
                            href={`/products?category=${c.slug}`}
                            onClick={() => setRayonsOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                          >
                            <span className="font-medium">{c.name}</span>
                            <span className="text-gray-300">›</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Nav links */}
                <nav className="ml-2 flex items-center gap-0.5">
                  <Link
                    href="/"
                    className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                      pathname === "/"
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                    }`}
                  >
                    Accueil
                  </Link>
                  <Link
                    href="/products"
                    className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                      pathname === "/products"
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                    }`}
                  >
                    Produits
                  </Link>
                  <Link
                    href="/track-order"
                    className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                      pathname === "/track-order"
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                    }`}
                  >
                    Suivre ma commande
                  </Link>
                  <Link
                    href="/products?promo=1"
                    className="ml-2 flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2.5 text-sm font-black text-white shadow-md shadow-red-500/20 transition hover:from-red-600 hover:to-orange-600"
                  >
                    <FireIcon />
                    Promotions
                  </Link>
                </nav>

                {/* Contact info */}
                <div className="ml-auto hidden items-center gap-4 text-xs lg:flex">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <TruckIcon />
                    Livraison 24h-48h
                  </span>
                  <span className="h-4 w-px bg-gray-200" />
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-1.5 font-bold text-navy-900 transition hover:text-orange-600"
                  >
                    <PhoneIcon />
                    {phone}
                  </a>
                </div>
              </div>
            </div>

            {/* -------- Mobile search -------- */}
            <form
              onSubmit={handleSearch}
              className="border-t border-gray-100 px-4 py-3 md:hidden"
            >
              <div className="flex h-11 overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-50 focus-within:border-orange-500">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="flex-1 bg-transparent px-4 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="m-1 flex items-center rounded-lg bg-orange-500 px-4 text-white"
                >
                  <SearchIcon />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ============ MOBILE DRAWER ============ */}
        {menuOpen && (
          <div className="px-3 pt-2 md:hidden">
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl">
              <div className="p-4">
                <nav className="flex flex-col">
                  <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
                  >
                    Accueil
                  </Link>
                  <Link
                    href="/products"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
                  >
                    Tous les produits
                  </Link>
                  <Link
                    href="/track-order"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
                  >
                    Suivre ma commande
                  </Link>
                  <Link
                    href="/products?promo=1"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-black text-red-600 transition hover:bg-red-50"
                  >
                    🔥 Promotions
                  </Link>
                </nav>

                {categories.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-widest text-gray-500">
                      Catégories
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          href={`/products?category=${c.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-bold text-white transition hover:bg-green-600"
                >
                  💬 Commander sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}