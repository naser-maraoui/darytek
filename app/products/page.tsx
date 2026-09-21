import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";
import MobileFilterDrawer from "@/components/store/MobileFilterDrawer";

type SearchParams = {
  search?: string;
  category?: string;
  sort?: string;
  promo?: string;
  priceMin?: string;
  priceMax?: string;
  inStock?: string;
};

// ---------- Icons ----------
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
function MoneyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

// Predefined price ranges (DT) — tuned for Tunisian appliance market
const PRICE_RANGES = [
  { label: "Moins de 200 DT", min: 0, max: 200 },
  { label: "200 - 500 DT", min: 200, max: 500 },
  { label: "500 - 1000 DT", min: 500, max: 1000 },
  { label: "1000 - 2000 DT", min: 1000, max: 2000 },
  { label: "Plus de 2000 DT", min: 2000, max: undefined },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const search = params.search?.trim() || "";
  const categorySlug = params.category?.trim() || "";
  const sort = params.sort?.trim() || "newest";
  const isPromo = params.promo === "1";
  const priceMin = params.priceMin ? Number(params.priceMin) : null;
  const priceMax = params.priceMax ? Number(params.priceMax) : null;
  const inStockOnly = params.inStock === "1";

  // Fetch categories for navbar + sidebar
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  // Fetch all products minimal data for computing counts
  const { data: allProductsForCounts } = await supabase
    .from("products")
    .select("category_id, price, stock, compare_at_price")
    .eq("is_available", true);

  const productsForCounts = allProductsForCounts ?? [];

  // Category counts
  const categoryCounts: Record<number, number> = {};
  for (const p of productsForCounts) {
    if (p.category_id != null) {
      categoryCounts[p.category_id] = (categoryCounts[p.category_id] ?? 0) + 1;
    }
  }

  // Price range counts
  const priceRangeCounts = PRICE_RANGES.map((range) =>
    productsForCounts.filter((p) => {
      const price = Number(p.price);
      if (range.min != null && price < range.min) return false;
      if (range.max != null && price > range.max) return false;
      return true;
    }).length
  );

  // In-stock count
  const inStockCount = productsForCounts.filter((p) => p.stock > 0).length;

  // Products query
  let productsQuery = supabase
    .from("products")
    .select(`
      id, name, slug, price, compare_at_price, stock, image_url, is_available, is_featured,
      categories (name, slug)
    `)
    .eq("is_available", true);

  // Sort
  if (sort === "price-asc") {
    productsQuery = productsQuery.order("price", { ascending: true });
  } else if (sort === "price-desc") {
    productsQuery = productsQuery.order("price", { ascending: false });
  } else if (sort === "name-asc") {
    productsQuery = productsQuery.order("name", { ascending: true });
  } else {
    productsQuery = productsQuery.order("created_at", { ascending: false });
  }

  if (search) {
    productsQuery = productsQuery.ilike("name", `%${search}%`);
  }

  const selectedCategory = categories?.find((c) => c.slug === categorySlug);
  if (selectedCategory) {
    productsQuery = productsQuery.eq("category_id", selectedCategory.id);
  }

  if (isPromo) {
    productsQuery = productsQuery.not("compare_at_price", "is", null);
  }

  if (priceMin != null && !Number.isNaN(priceMin)) {
    productsQuery = productsQuery.gte("price", priceMin);
  }
  if (priceMax != null && !Number.isNaN(priceMax)) {
    productsQuery = productsQuery.lte("price", priceMax);
  }

  if (inStockOnly) {
    productsQuery = productsQuery.gt("stock", 0);
  }

  const { data: products, error: productsError } = await productsQuery;

  const finalProducts = isPromo
    ? (products ?? []).filter(
        (p) => Number(p.compare_at_price) > Number(p.price)
      )
    : products ?? [];

  const hasFilters = Boolean(
    search || categorySlug || isPromo || priceMin || priceMax || inStockOnly
  );

  const activeFilterCount = [
    search,
    categorySlug,
    isPromo,
    priceMin,
    priceMax,
    inStockOnly,
  ].filter(Boolean).length;

  const resultCount = finalProducts.length;

  // Helper: build a URL preserving all params except the ones being changed
  const buildHref = (overrides: Record<string, string | undefined>) => {
    const merged: Record<string, string> = {};
    if (search) merged.search = search;
    if (categorySlug) merged.category = categorySlug;
    if (sort && sort !== "newest") merged.sort = sort;
    if (isPromo) merged.promo = "1";
    if (priceMin != null) merged.priceMin = String(priceMin);
    if (priceMax != null) merged.priceMax = String(priceMax);
    if (inStockOnly) merged.inStock = "1";

    for (const [k, v] of Object.entries(overrides)) {
      if (v === undefined) delete merged[k];
      else merged[k] = v;
    }

    const qs = new URLSearchParams(merged).toString();
    return qs ? `/products?${qs}` : "/products";
  };

  // Filters panel content (shared between desktop sidebar and mobile drawer)
  const renderFiltersPanel = () => (
    <div className="space-y-5">
      {/* Categories */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
          <FilterIcon />
          <h2 className="text-sm font-black text-gray-900">Catégories</h2>
        </div>
        <div className="p-2">
          <Link
            href={buildHref({ category: undefined })}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
              !categorySlug
                ? "bg-orange-50 font-bold text-orange-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>Toutes les catégories</span>
            <span className="text-[11px] font-bold text-gray-400">
              {productsForCounts.length}
            </span>
          </Link>

          {categories?.map((c) => {
            const count = categoryCounts[c.id] ?? 0;
            const isActive = categorySlug === c.slug;
            return (
              <Link
                key={c.id}
                href={buildHref({
                  category: isActive ? undefined : c.slug,
                })}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-orange-50 font-bold text-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="truncate">{c.name}</span>
                <span className="text-[11px] font-bold text-gray-400">
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
          <MoneyIcon />
          <h2 className="text-sm font-black text-gray-900">Prix (DT)</h2>
        </div>

        <div className="space-y-1 p-2">
          {PRICE_RANGES.map((range, i) => {
            const isActive =
              priceMin === (range.min ?? null) &&
              priceMax === (range.max ?? null);
            return (
              <Link
                key={range.label}
                href={buildHref({
                  priceMin: isActive ? undefined : String(range.min),
                  priceMax:
                    isActive || range.max == null
                      ? undefined
                      : String(range.max),
                })}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-orange-50 font-bold text-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{range.label}</span>
                <span className="text-[11px] font-bold text-gray-400">
                  {priceRangeCounts[i]}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Custom range */}
        <form
          action="/products"
          method="GET"
          className="border-t border-gray-100 p-3"
        >
          {search && <input type="hidden" name="search" value={search} />}
          {categorySlug && (
            <input type="hidden" name="category" value={categorySlug} />
          )}
          {isPromo && <input type="hidden" name="promo" value="1" />}
          {inStockOnly && <input type="hidden" name="inStock" value="1" />}
          {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}

          <p className="mb-2 text-[11px] font-bold text-gray-500">
            Plage personnalisée
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="priceMin"
              min="0"
              placeholder="Min"
              defaultValue={priceMin ?? ""}
              className="h-9 w-full rounded-lg border border-gray-200 px-3 text-xs outline-none focus:border-orange-500"
            />
            <span className="text-gray-300">—</span>
            <input
              type="number"
              name="priceMax"
              min="0"
              placeholder="Max"
              defaultValue={priceMax ?? ""}
              className="h-9 w-full rounded-lg border border-gray-200 px-3 text-xs outline-none focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-navy-900 py-2 text-xs font-bold text-white transition hover:bg-orange-500"
          >
            Appliquer
          </button>
        </form>
      </div>

      {/* Availability + Promo */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
          <h2 className="text-sm font-black text-gray-900">Disponibilité</h2>
        </div>
        <div className="p-3">
          <Link
            href={buildHref({ inStock: inStockOnly ? undefined : "1" })}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
              inStockOnly
                ? "bg-orange-50 font-bold text-orange-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  inStockOnly ? "bg-orange-500" : "bg-gray-300"
                }`}
              />
              En stock uniquement
            </span>
            <span className="text-[11px] font-bold text-gray-400">
              {inStockCount}
            </span>
          </Link>

          <Link
            href={buildHref({ promo: isPromo ? undefined : "1" })}
            className={`mt-1 flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
              isPromo
                ? "bg-red-50 font-bold text-red-600"
                : "text-gray-700 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <span className="flex items-center gap-1.5">
              🔥 En promotion
            </span>
          </Link>
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
        >
          <CloseIcon />
          Effacer tous les filtres
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar categories={categories ?? []} />

      {/* Breadcrumb */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
            <Link href="/" className="hover:text-orange-600">
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900">
              {isPromo
                ? "Promotions"
                : selectedCategory
                ? selectedCategory.name
                : "Produits"}
            </span>
          </nav>
        </div>
      </section>

      {/* Page header */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            {isPromo
              ? "🔥 Promotions en cours"
              : selectedCategory
              ? selectedCategory.name
              : "Tous nos produits"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {search
              ? `Résultats pour "${search}"`
              : isPromo
              ? "Découvrez nos meilleures offres sur une sélection d'appareils"
              : selectedCategory
              ? `Découvrez notre sélection ${selectedCategory.name.toLowerCase()}`
              : "Découvrez notre sélection d'appareils électroménagers"}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-6 lg:py-8">
        {productsError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Une erreur est survenue lors du chargement des produits.
          </div>
        )}

        {/* Toolbar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Mobile filter button */}
            <div className="lg:hidden">
              <MobileFilterDrawer activeCount={activeFilterCount}>
                {renderFiltersPanel()}
              </MobileFilterDrawer>
            </div>

            <p className="text-sm text-gray-600">
              <span className="font-black text-gray-900">{resultCount}</span>{" "}
              produit{resultCount > 1 ? "s" : ""} trouvé
              {resultCount > 1 ? "s" : ""}
            </p>
          </div>

          <form
            action="/products"
            method="GET"
            className="flex items-center gap-2"
          >
            {search && <input type="hidden" name="search" value={search} />}
            {categorySlug && (
              <input type="hidden" name="category" value={categorySlug} />
            )}
            {isPromo && <input type="hidden" name="promo" value="1" />}
            {priceMin != null && (
              <input type="hidden" name="priceMin" value={priceMin} />
            )}
            {priceMax != null && (
              <input type="hidden" name="priceMax" value={priceMax} />
            )}
            {inStockOnly && (
              <input type="hidden" name="inStock" value="1" />
            )}
            <label
              htmlFor="sort"
              className="hidden text-xs font-bold text-gray-500 sm:inline"
            >
              Trier par
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-800 outline-none focus:border-orange-500"
            >
              <option value="newest">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name-asc">Nom (A-Z)</option>
            </select>
            <button
              type="submit"
              className="flex h-11 items-center rounded-xl bg-navy-900 px-4 text-xs font-bold text-white transition hover:bg-orange-500"
            >
              OK
            </button>
          </form>
        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500">
              Filtres actifs :
            </span>

            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                🔍 {search}
                <Link
                  href={buildHref({ search: undefined })}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <CloseIcon />
                </Link>
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
                📁 {selectedCategory.name}
                <Link
                  href={buildHref({ category: undefined })}
                  className="text-orange-500 hover:text-orange-700"
                >
                  <CloseIcon />
                </Link>
              </span>
            )}

            {(priceMin != null || priceMax != null) && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                💰 {priceMin != null ? `${priceMin}` : "0"} —{" "}
                {priceMax != null ? `${priceMax}` : "∞"} DT
                <Link
                  href={buildHref({
                    priceMin: undefined,
                    priceMax: undefined,
                  })}
                  className="text-green-500 hover:text-green-700"
                >
                  <CloseIcon />
                </Link>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                ✓ En stock
                <Link
                  href={buildHref({ inStock: undefined })}
                  className="text-emerald-500 hover:text-emerald-700"
                >
                  <CloseIcon />
                </Link>
              </span>
            )}

            {isPromo && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
                🔥 Promotions
                <Link
                  href={buildHref({ promo: undefined })}
                  className="text-red-500 hover:text-red-700"
                >
                  <CloseIcon />
                </Link>
              </span>
            )}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              {renderFiltersPanel()}
            </div>
          </aside>

          {/* Products */}
          <div>
            {finalProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {finalProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  <SearchIcon />
                </div>
                <h2 className="mt-5 text-lg font-black text-gray-900 sm:text-xl">
                  {isPromo
                    ? "Aucune promotion en cours"
                    : "Aucun produit trouvé"}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  {hasFilters
                    ? "Essayez de modifier vos filtres ou votre recherche."
                    : "Aucun produit disponible pour le moment."}
                </p>
                {hasFilters && (
                  <Link
                    href="/products"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-black text-white transition hover:bg-orange-600"
                  >
                    Voir tous les produits
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer
        whatsapp={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}
        phone={process.env.NEXT_PUBLIC_PHONE ?? "+216 XX XXX XXX"}
      />
    </div>
  );
}