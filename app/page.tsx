import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import HeroSlider from "@/components/store/HeroSlider";
import ProductCarousel from "@/components/store/ProductCarousel";
import ProductCard from "@/components/store/ProductCard";
import CountdownTimer from "@/components/store/CountdownTimer";
import TestimonialsMarquee from "@/components/store/TestimonialsMarquee";

// ---------- Icons ----------
function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}
function CashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
function HeadsetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm18 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5Z" />
      <path d="M21 11a9 9 0 1 0-18 0" />
      <path d="M21 16v2a4 4 0 0 1-4 4h-3" />
    </svg>
  );
}
function FlashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

const brands = [
  "Samsung",
  "LG",
  "Whirlpool",
  "Bosch",
  "Beko",
  "Moulinex",
  "Philips",
  "Tefal",
  "Siemens",
  "Candy",
];

export default async function HomePage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description, image_url")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const productSelect = `
    id, name, slug, price, compare_at_price, stock, image_url, is_available, is_featured,
    categories (name, slug)
  `;

  const [featuredRes, latestRes, promosRes, totalRes] = await Promise.all([
    supabase
      .from("products")
      .select(productSelect)
      .eq("is_available", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(10),

    supabase
      .from("products")
      .select(productSelect)
      .eq("is_available", true)
      .order("created_at", { ascending: false })
      .limit(12),

    supabase
      .from("products")
      .select(productSelect)
      .eq("is_available", true)
      .not("compare_at_price", "is", null)
      .order("created_at", { ascending: false })
      .limit(10),

    supabase.from("products").select("*", { count: "exact", head: true }),
  ]);

  const featuredProducts = featuredRes.data ?? [];
  const latestProducts = latestRes.data ?? [];
  const promoProducts = (promosRes.data ?? []).filter(
    (p) => Number(p.compare_at_price) > Number(p.price)
  );
  const totalProducts = totalRes.count ?? 0;

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const phone = process.env.NEXT_PUBLIC_PHONE ?? "+216 XX XXX XXX";

  const flashEndsAt = new Date();
  flashEndsAt.setHours(23, 59, 59, 999);

  // Show 8 round categories
  const roundCats = (categories ?? []).slice(0, 8);

  return (
    <main className="min-h-screen bg-white">
      <Navbar categories={categories ?? []} />

      {/* ============ 1. HERO ============ */}
      <section className="bg-gradient-to-b from-orange-50/40 to-white pb-6 pt-4">
        <div className="mx-auto max-w-7xl px-4">
          <HeroSlider />
        </div>
      </section>

      {/* ============ 2. VENTES FLASH ============ */}
      {promoProducts.length > 0 && (
        <section className="pb-14 pt-2">
          <div className="mx-auto max-w-7xl px-4">
            {/* Header banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-500 to-orange-500 px-6 py-6 shadow-xl shadow-red-500/20 sm:px-8 sm:py-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5" />

              <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur">
                    <FlashIcon />
                    Offres flash
                  </span>
                  <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                    Ventes flash du jour
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-white/85">
                    Profitez de nos meilleures offres avant la fin de la
                    journée. Stocks limités.
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 lg:items-end">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/80">
                    Se termine dans
                  </p>
                  <CountdownTimer endsAt={flashEndsAt} />
                  <Link
                    href="/products?promo=1"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-red-600 shadow-lg transition hover:scale-105"
                  >
                    Voir toutes les offres
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            </div>

            {/* Products carousel below the banner */}
            <div className="mt-6">
              <ProductCarousel products={promoProducts} />
            </div>
          </div>
        </section>
      )}

      
      {/* ============ 3. CATEGORIES — ROUND (uniform) ============ */}
        {roundCats.length > 0 && (
          <section className="bg-white pb-16 pt-2">
            <div className="mx-auto max-w-7xl px-4">
              <div className="mb-8 flex items-end justify-between gap-4 border-b border-gray-200 pb-3">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-orange-600">
                    🧭 Explorer par catégorie
                  </span>
                  <h2 className="mt-1 text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                    Nos univers
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="flex items-center gap-1 text-xs font-bold text-gray-700 transition hover:text-orange-600 sm:text-sm"
                >
                  Voir tout <ArrowRight />
                </Link>
              </div>

              {/* Uniform grid — all circles same size, roomier spacing */}
              <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 sm:gap-8 lg:grid-cols-6 lg:gap-8 xl:grid-cols-8 xl:gap-6">
                {roundCats.map((c) => (
                  <Link
                    key={c.id}
                    href={`/products?category=${c.slug}`}
                    className="group flex flex-col items-center gap-3"
                  >
                    <div className="relative aspect-square w-full max-w-[140px] overflow-hidden rounded-full border-[3px] border-white bg-gradient-to-br from-orange-50 to-orange-100 shadow-md ring-1 ring-gray-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-orange-500/20 group-hover:ring-[3px] group-hover:ring-orange-500">
                      {c.image_url ? (
                        <Image
                          src={c.image_url}
                          alt={c.name}
                          fill
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 140px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl font-black text-orange-500">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="line-clamp-2 text-center text-xs font-black text-gray-800 transition group-hover:text-orange-600 sm:text-[13px]">
                      {c.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* ============ 4. TRUST BAR ============ */}
      <section className="bg-white pb-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { Icon: TruckIcon, t: "Livraison rapide", s: "Partout en Tunisie" },
              { Icon: CashIcon, t: "Paiement livraison", s: "Simple et sécurisé" },
              { Icon: HeadsetIcon, t: "Support 7j/7", s: "Réponse rapide" },
              { Icon: ShieldIcon, t: "Produits garantis", s: "Qualité vérifiée" },
            ].map(({ Icon, t, s }) => (
              <div
                key={t}
                className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                  <Icon />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-gray-900 sm:text-sm">
                    {t}
                  </p>
                  <p className="truncate text-[11px] text-gray-500">{s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 5. FEATURED CAROUSEL (auto-roll) ============ */}
      {featuredProducts.length > 0 && (
        <section className="bg-gradient-to-b from-gray-50 to-white py-14">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-gray-200 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-orange-600">
                  ⭐ Sélection du moment
                </span>
                <h2 className="mt-1 text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                  Produits populaires
                </h2>
              </div>
              <Link
                href="/products"
                className="flex items-center gap-1 text-xs font-bold text-gray-700 transition hover:text-orange-600 sm:text-sm"
              >
                Voir tout <ArrowRight />
              </Link>
            </div>
            <ProductCarousel products={featuredProducts} />
          </div>
        </section>
      )}

      {/* ============ 6. STATS ============ */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: `${totalProducts}+`, label: "Produits disponibles" },
              { value: "48h", label: "Livraison max" },
              { value: "100%", label: "Clients satisfaits" },
              { value: "7j/7", label: "Support client" },
            ].map((s) => (
              <div
                key={s.label}
                className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 text-center transition hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5"
              >
                <p className="text-3xl font-black tracking-tight text-navy-900 sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500">
                  {s.label}
                </p>
                <div className="mx-auto mt-3 h-1 w-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 7. LATEST GRID ============ */}
      {latestProducts.length > 0 && (
        <section className="bg-gradient-to-b from-white to-gray-50 py-14">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-gray-200 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-orange-600">
                  ✨ Nouveautés
                </span>
                <h2 className="mt-1 text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                  Derniers arrivages
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Découvrez les derniers produits ajoutés à notre catalogue.
                </p>
              </div>
              <Link
                href="/products"
                className="hidden items-center gap-1 text-xs font-bold text-gray-700 transition hover:text-orange-600 sm:flex sm:text-sm"
              >
                Voir tout <ArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
              {latestProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-8 py-4 text-sm font-black text-white shadow-lg shadow-navy-900/20 transition hover:scale-105 hover:bg-orange-500 hover:shadow-orange-500/30"
              >
                Voir tous les produits
                <ArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ 8. BRAND MARQUEE ============ */}
      <section className="overflow-hidden border-y border-gray-100 bg-white py-10">
        <div className="mx-auto mb-6 max-w-7xl px-4">
          <div className="text-center">
            <span className="text-[11px] font-black uppercase tracking-widest text-orange-600">
              🏆 Nos marques
            </span>
            <h2 className="mt-1 text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
              Marques partenaires
            </h2>
          </div>
        </div>

        <div className="relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...brands, ...brands].map((b, i) => (
              <div
                key={i}
                className="mx-3 flex h-16 w-36 flex-shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white text-sm font-black tracking-wide text-gray-400 transition hover:border-orange-500 hover:text-orange-600"
              >
                {b}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
        </div>
      </section>

      {/* ============ 9. TESTIMONIALS ============ */}
      <TestimonialsMarquee />

      {/* ============ 10. CONTACT ============ */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-navy-950 px-6 py-12 sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div>
                <span className="inline-flex rounded-full bg-orange-500/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-orange-400">
                  Besoin d&apos;aide ?
                </span>
                <h2 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                  Un conseil ? Une question ?
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                  Notre équipe vous aide à trouver le produit adapté à votre
                  besoin. Réponse rapide sur WhatsApp.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-green-500/25 transition hover:scale-105 hover:bg-green-400"
                  >
                    💬 WhatsApp
                  </a>
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 bg-white/5 px-6 py-3.5 text-sm font-black text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
                  >
                    📞 {phone}
                  </a>
                </div>
              </div>

              <div className="hidden justify-center lg:flex">
                <div className="relative h-56 w-56 animate-float rounded-full bg-gradient-to-br from-orange-500/30 to-orange-700/20 backdrop-blur-sm">
                  <div className="absolute inset-0 flex items-center justify-center text-8xl">
                    📞
                  </div>
                  <div className="absolute -right-4 -top-4 flex h-16 w-16 animate-float-slow items-center justify-center rounded-full bg-orange-500 text-3xl shadow-xl shadow-orange-500/40">
                    💬
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 11. FOOTER ============ */}
      <Footer whatsapp={whatsapp} phone={phone} />
    </main>
  );
}