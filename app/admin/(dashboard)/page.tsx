import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ---------- Icons ----------
function DollarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function PackageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
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
function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function FireIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" x2="12" y1="9" y2="13" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const statusColors: Record<string, string> = {
  pending: "bg-orange-100 text-orange-700",
  confirmed: "bg-orange-100 text-orange-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login");
  }

  // ---- Parallel fetches ----
  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: ordersCount },
    { count: pendingOrdersCount },
    { data: recentOrders },
    { data: allOrderTotals },
    { count: promoCount },
    { data: lowStockProducts },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),

    supabase.from("categories").select("*", { count: "exact", head: true }),

    supabase.from("orders").select("*", { count: "exact", head: true }),

    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),

    supabase
      .from("orders")
      .select("id, customer_name, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),

    supabase.from("orders").select("total, status"),

    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .not("compare_at_price", "is", null),

    supabase
      .from("products")
      .select("id, name, stock, image_url")
      .lte("stock", 5)
      .eq("is_available", true)
      .order("stock", { ascending: true })
      .limit(4),
  ]);

  // Revenue = sum of non-cancelled orders
  const revenue = (allOrderTotals ?? [])
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const deliveredCount =
    (allOrderTotals ?? []).filter((o) => o.status === "delivered").length;

  const avgOrderValue =
    allOrderTotals && allOrderTotals.filter((o) => o.status !== "cancelled").length > 0
      ? revenue /
        allOrderTotals.filter((o) => o.status !== "cancelled").length
      : 0;

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-500">
          Bienvenue, {profile.full_name || "Admin"} 👋
        </p>
      </div>

      {/* ============ PRIMARY STATS ============ */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white shadow-lg shadow-blue-600/20">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-blue-200">
                Chiffre d&apos;affaires
              </p>
              <p className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                {revenue.toFixed(0)}
                <span className="ml-1 text-sm font-bold text-blue-200">DT</span>
              </p>
              <p className="mt-1 text-[11px] text-blue-200">
                Commande moy. : {avgOrderValue.toFixed(0)} DT
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <DollarIcon />
            </div>
          </div>
        </div>

        {/* Orders */}
        <Link
          href="/admin/orders"
          className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                Commandes
              </p>
              <p className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                {ordersCount ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                {deliveredCount} livrée{deliveredCount > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <CartIcon />
            </div>
          </div>
          <span className="absolute bottom-4 right-5 flex items-center gap-1 text-[11px] font-bold text-orange-600 opacity-0 transition group-hover:opacity-100">
            Voir <ArrowRight />
          </span>
        </Link>

        {/* Products */}
        <Link
          href="/admin/products"
          className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                Produits
              </p>
              <p className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                {productsCount ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                {promoCount ?? 0} en promotion
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <PackageIcon />
            </div>
          </div>
          <span className="absolute bottom-4 right-5 flex items-center gap-1 text-[11px] font-bold text-orange-600 opacity-0 transition group-hover:opacity-100">
            Voir <ArrowRight />
          </span>
        </Link>

        {/* Pending */}
        <Link
          href="/admin/orders?status=pending"
          className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-orange-200 transition hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-orange-600">
                En attente
              </p>
              <p className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                {pendingOrdersCount ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-orange-500">
                {(pendingOrdersCount ?? 0) > 0
                  ? "À traiter"
                  : "Tout est à jour ✓"}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <ClockIcon />
            </div>
          </div>
          {(pendingOrdersCount ?? 0) > 0 && (
            <span className="absolute right-4 top-4 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
          )}
        </Link>
      </div>

      {/* ============ SECONDARY STATS ============ */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/categories"
          className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <FolderIcon />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
              Catégories
            </p>
            <p className="text-xl font-black text-gray-900">
              {categoriesCount ?? 0}
            </p>
          </div>
        </Link>

        <Link
          href="/admin/products?filter=promo"
          className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <FireIcon />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
              Promotions
            </p>
            <p className="text-xl font-black text-gray-900">
              {promoCount ?? 0}
            </p>
          </div>
        </Link>

        <Link
          href="/admin/products?filter=out-of-stock"
          className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <AlertIcon />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
              Stock faible
            </p>
            <p className="text-xl font-black text-gray-900">
              {lowStockProducts?.length ?? 0}
            </p>
          </div>
        </Link>
      </div>

      {/* ============ MAIN GRID ============ */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Recent orders */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b bg-gray-50 px-5 py-4">
            <h2 className="flex items-center gap-2 text-sm font-black text-gray-900">
              <span className="h-1 w-1 rounded-full bg-orange-500" />
              Commandes récentes
            </h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              Tout voir <ArrowRight />
            </Link>
          </div>

          {recentOrders && recentOrders.length > 0 ? (
            <div className="divide-y">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-600">
                    #{order.id}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {order.customer_name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-black text-gray-900">
                      {Number(order.total).toFixed(2)}
                      <span className="ml-1 text-[10px] font-bold text-gray-500">
                        DT
                      </span>
                    </p>
                    <span
                      className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-black ${
                        statusColors[order.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-gray-500">
                Aucune commande pour le moment.
              </p>
            </div>
          )}
        </div>

        {/* Right column: Quick actions + Low stock */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b bg-gray-50 px-5 py-4">
              <h2 className="text-sm font-black text-gray-900">
                Actions rapides
              </h2>
            </div>
            <div className="p-3">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 rounded-xl bg-gray-900 px-4 py-3 text-white transition hover:bg-gray-800"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <PlusIcon />
                </span>
                <span className="text-sm font-bold">Ajouter un produit</span>
              </Link>

              <Link
                href="/admin/categories/new"
                className="mt-2 flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-gray-800 transition hover:bg-gray-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                  <PlusIcon />
                </span>
                <span className="text-sm font-bold">
                  Ajouter une catégorie
                </span>
              </Link>

              <Link
                href="/admin/orders?status=pending"
                className="mt-2 flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-orange-900 transition hover:bg-orange-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                  <ClockIcon />
                </span>
                <span className="text-sm font-bold">
                  Traiter les commandes
                </span>
              </Link>
            </div>
          </div>

          {/* Low stock */}
          {lowStockProducts && lowStockProducts.length > 0 && (
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="flex items-center justify-between border-b bg-amber-50 px-5 py-4">
                <h2 className="flex items-center gap-2 text-sm font-black text-amber-900">
                  <AlertIcon />
                  Stock faible
                </h2>
                <Link
                  href="/admin/products?filter=out-of-stock"
                  className="text-[11px] font-bold text-amber-700 hover:underline"
                >
                  Voir tout
                </Link>
              </div>
              <div className="divide-y">
                {lowStockProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/products/${p.id}/edit`}
                    className="flex items-center gap-3 px-5 py-3 transition hover:bg-gray-50"
                  >
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                      {p.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                          —
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-gray-900">
                        {p.name}
                      </p>
                      <p
                        className={`text-[11px] font-black ${
                          p.stock <= 0
                            ? "text-red-600"
                            : "text-amber-600"
                        }`}
                      >
                        {p.stock <= 0 ? "Rupture" : `${p.stock} restant`}
                        {p.stock > 1 ? "s" : ""}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}