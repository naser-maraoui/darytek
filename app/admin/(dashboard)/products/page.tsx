import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const filter = params.filter ?? "all";

  // Build query based on filter
  let query = supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      compare_at_price,
      stock,
      is_available,
      is_featured,
      image_url,
      categories (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (filter === "promo") {
    query = query.not("compare_at_price", "is", null);
  } else if (filter === "featured") {
    query = query.eq("is_featured", true);
  } else if (filter === "out-of-stock") {
    query = query.lte("stock", 0);
  }

  const { data: productsRaw, error } = await query;

  // Post-filter real promos (compare_at_price > price)
  const products =
    filter === "promo"
      ? (productsRaw ?? []).filter(
          (p) =>
            p.compare_at_price != null &&
            Number(p.compare_at_price) > Number(p.price)
        )
      : productsRaw ?? [];

  const filterTabs = [
    { key: "all", label: "Tous les produits" },
    { key: "promo", label: "🔥 Promotions" },
    { key: "featured", label: "⭐ En vedette" },
    { key: "out-of-stock", label: "⚠ Rupture" },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-sm text-gray-500">Manage your products</p>
          </div>

          <Link
            href="/admin/products/new"
            className="rounded-xl bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
          >
            + Add Product
          </Link>
        </div>
      </header>

      {/* Filter tabs */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-2 overflow-x-auto py-3">
            {filterTabs.map((tab) => {
              const active = filter === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={
                    tab.key === "all"
                      ? "/admin/products"
                      : `/admin/products?filter=${tab.key}`
                  }
                  className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                    active
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error.message}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const category = Array.isArray(product.categories)
                    ? product.categories[0]
                    : product.categories;

                  const isOutOfStock = product.stock <= 0;

                  const hasPromo =
                    product.compare_at_price != null &&
                    Number(product.compare_at_price) > Number(product.price);

                  const discountPct = hasPromo
                    ? Math.round(
                        ((Number(product.compare_at_price) -
                          Number(product.price)) /
                          Number(product.compare_at_price)) *
                          100
                      )
                    : 0;

                  return (
                    <tr
                      key={product.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-14 w-14 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                              No image
                            </div>
                          )}

                          <div>
                            <p className="font-medium">{product.name}</p>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              {hasPromo && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-black text-red-700">
                                  🔥 -{discountPct}%
                                </span>
                              )}

                              {product.is_featured && (
                                <span className="text-xs font-semibold text-amber-600">
                                  ⭐ Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {category?.name ?? "No category"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {Number(product.price).toFixed(2)} DT
                          </span>
                          {hasPromo && (
                            <span className="text-xs text-gray-400 line-through">
                              {Number(product.compare_at_price).toFixed(2)} DT
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            isOutOfStock
                              ? "font-semibold text-red-600"
                              : "font-medium text-gray-900"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {isOutOfStock ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            Out of stock
                          </span>
                        ) : product.is_available ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Available
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            Hidden
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="font-medium hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              {filter === "promo"
                ? "Aucun produit en promotion pour le moment."
                : filter === "featured"
                ? "Aucun produit en vedette."
                : filter === "out-of-stock"
                ? "Aucun produit en rupture de stock."
                : "No products yet."}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}