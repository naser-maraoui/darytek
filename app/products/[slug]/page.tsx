import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/store/Navbar";
import ProductCard from "@/components/store/ProductCard";
import AddToCartButton from "@/components/store/AddToCartButton";
import ImageGallery from "@/components/store/ImageGallery";

type Props = {
  params: Promise<{ slug: string }>;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image_url: string | null;
  images: string[] | null;
  is_available: boolean;
  is_featured: boolean;
  categories: { name: string; slug: string }[] | null;
};

// ---------- Icons ----------
function TruckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function WhatsappIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch all categories for Navbar
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  // Fetch product (include compare_at_price + images)
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, description, price, compare_at_price, stock,
      image_url, images, is_available,
      categories (name, slug)
    `)
    .eq("slug", slug)
    .eq("is_available", true)
    .single();

  if (error || !product) {
    notFound();
  }

  const category = Array.isArray(product.categories)
    ? product.categories[0]
    : product.categories;

  // Fetch related products (same category, exclude current)
  let relatedProducts: Product[] = [];
  if (category?.slug) {
    const { data } = await supabase
      .from("products")
      .select(`
        id, name, slug, price, compare_at_price, stock, image_url, images,
        is_available, is_featured,
        categories (name, slug)
      `)
      .eq("is_available", true)
      .eq("categories.slug", category.slug)
      .neq("id", product.id)
      .limit(4);

    relatedProducts = (data ?? []) as Product[];
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappMessage = encodeURIComponent(
    `Bonjour, je suis intéressé par le produit : ${product.name} - ${Number(
      product.price
    ).toFixed(2)} DT`
  );
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : "#";

  const isOutOfStock = product.stock <= 0;
  const isAvailable = product.is_available && !isOutOfStock;

  const hasPromo =
    product.compare_at_price != null &&
    Number(product.compare_at_price) > Number(product.price);

  const discountPct = hasPromo
    ? Math.round(
        ((Number(product.compare_at_price) - Number(product.price)) /
          Number(product.compare_at_price)) *
          100
      )
    : 0;

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
      ? [product.image_url]
      : [];

  return (
    <main className="min-h-screen bg-white">
      <Navbar categories={categories ?? []} />

      {/* ============ BREADCRUMB ============ */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
            <Link href="/" className="hover:text-orange-600">
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/products" className="hover:text-orange-600">
              Produits
            </Link>
            {category && (
              <>
                <span className="text-gray-300">/</span>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="hover:text-orange-600"
                >
                  {category.name}
                </Link>
              </>
            )}
            <span className="text-gray-300">/</span>
            <span className="truncate font-semibold text-gray-900">
              {product.name}
            </span>
          </nav>
        </div>
      </section>

      {/* ============ PRODUCT ============ */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          {/* ---------- LEFT: IMAGE GALLERY ---------- */}
          <div>
            <ImageGallery
              images={galleryImages}
              alt={product.name}
              badge={
                <>
                  {hasPromo && isAvailable && (
                    <span className="absolute left-4 top-4 z-10 rounded-md bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 text-xs font-black text-white shadow-md shadow-red-500/30">
                      -{discountPct}%
                    </span>
                  )}
                  {isOutOfStock ? (
                    <span className="absolute right-4 top-4 z-10 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-black text-white">
                      Rupture de stock
                    </span>
                  ) : (
                    <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-md bg-green-100 px-3 py-1.5 text-xs font-black text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      En stock
                    </span>
                  )}
                </>
              }
            />
          </div>

          {/* ---------- RIGHT: INFO ---------- */}
          <div className="flex flex-col">
            {category && (
              <Link
                href={`/products?category=${category.slug}`}
                className="inline-flex w-fit items-center gap-1 text-[11px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700"
              >
                {category.name}
              </Link>
            )}

            <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-gray-100 pb-5">
              <span
                className={`text-3xl font-black tracking-tight sm:text-4xl ${
                  hasPromo ? "text-red-600" : "text-navy-900"
                }`}
              >
                {Number(product.price).toFixed(2)}
                <span className="ml-1 text-base font-bold text-gray-500">
                  DT
                </span>
              </span>
              {hasPromo && (
                <span className="text-base font-medium text-gray-400 line-through">
                  {Number(product.compare_at_price).toFixed(2)} DT
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-5 line-clamp-3 text-sm leading-7 text-gray-600">
                {product.description}
              </p>
            )}

            {/* CTAs */}
            {isAvailable ? (
              <div className="mt-6 space-y-3">
                <AddToCartButton
                  variant="detail"
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    stock: product.stock,
                    image_url: product.image_url,
                  }}
                />

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-500 bg-white py-3.5 text-sm font-black text-green-600 transition hover:bg-green-50"
                >
                  <WhatsappIcon />
                  Commander via WhatsApp
                </a>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-center">
                <p className="text-sm font-bold text-red-700">
                  Ce produit est actuellement indisponible
                </p>
                <p className="mt-1 text-xs text-red-600">
                  Contactez-nous pour connaître la disponibilité
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-600"
                >
                  <WhatsappIcon />
                  Demander la disponibilité
                </a>
              </div>
            )}

            {/* Trust strip */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-gray-100 pt-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <TruckIcon />
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-900">
                    Livraison
                  </p>
                  <p className="text-[10px] text-gray-500">Toute la Tunisie</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <CardIcon />
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-900">
                    Paiement
                  </p>
                  <p className="text-[10px] text-gray-500">À la livraison</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <ShieldIcon />
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-900">
                    Garantie
                  </p>
                  <p className="text-[10px] text-gray-500">Produit vérifié</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ DESCRIPTION (FULL) ============ */}
        {product.description && (
          <div className="mt-12 overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
              <h2 className="flex items-center gap-2 text-base font-black text-gray-900">
                <span className="h-1 w-1 rounded-full bg-orange-500" />
                Description du produit
              </h2>
            </div>
            <div className="p-5 sm:p-7">
              <p className="whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
                {product.description}
              </p>
            </div>
          </div>
        )}

        {/* ============ TRUST GRID ============ */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: <TruckIcon />,
              t: "Livraison rapide",
              s: "Nous livrons dans toute la Tunisie sous 24h à 72h.",
            },
            {
              icon: <CardIcon />,
              t: "Paiement à la livraison",
              s: "Payez en espèces quand vous recevez votre commande.",
            },
            {
              icon: <ShieldIcon />,
              t: "Produits garantis",
              s: "Chaque article est vérifié avant expédition.",
            },
          ].map((item) => (
            <div
              key={item.t}
              className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-black text-gray-900">{item.t}</p>
                <p className="mt-0.5 text-xs leading-5 text-gray-500">
                  {item.s}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ RELATED PRODUCTS ============ */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-gray-200 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-orange-600">
                  Vous aimerez aussi
                </span>
                <h2 className="mt-1 text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                  Produits similaires
                </h2>
              </div>
              <Link
                href={`/products?category=${category?.slug ?? ""}`}
                className="flex items-center gap-1 text-xs font-bold text-gray-700 transition hover:text-orange-600 sm:text-sm"
              >
                Voir tout <ArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ WHATSAPP CTA ============ */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 px-6 py-10 sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20" />
            <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-orange-500/10" />

            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <span className="inline-flex rounded-full bg-green-500/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-green-400">
                  Besoin d&apos;aide ?
                </span>
                <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
                  Une question sur ce produit ?
                </h2>
                <p className="mt-2 max-w-xl text-sm text-gray-300">
                  Notre équipe vous répond rapidement sur WhatsApp pour vous
                  conseiller avant l&apos;achat.
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-green-500/25 transition hover:bg-green-400"
              >
                <WhatsappIcon />
                Contacter sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-gray-500 sm:flex-row">
            <p>
              © {new Date().getFullYear()} Darytek — Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-orange-600">
                Accueil
              </Link>
              <Link href="/products" className="hover:text-orange-600">
                Produits
              </Link>
              <Link href="/track-order" className="hover:text-orange-600">
                Suivi
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}