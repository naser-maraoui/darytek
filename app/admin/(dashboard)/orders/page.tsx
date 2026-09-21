import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SearchParams = {
  status?: string;
};

const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

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

// ---------- Icons ----------
function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function WhatsappIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
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

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const selectedStatus = params.status;

  // Fetch all orders once to compute status counts
  const { data: allOrders } = await supabase
    .from("orders")
    .select("status");

  // Count per status
  const counts: Record<string, number> = {
    all: allOrders?.length ?? 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  for (const o of allOrders ?? []) {
    if (counts[o.status] !== undefined) counts[o.status]++;
  }

  // Fetch filtered orders
  let query = supabase
    .from("orders")
    .select(`
      id,
      customer_name,
      customer_phone,
      customer_address,
      total,
      status,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (selectedStatus && statuses.includes(selectedStatus as (typeof statuses)[number])) {
    query = query.eq("status", selectedStatus);
  }

  const { data: orders, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // Revenue only on non-cancelled orders
  const revenue =
    allOrders
      ?.filter((o) => o.status !== "cancelled")
      .length ?? 0;

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Commandes</h1>
        <p className="mt-2 text-gray-500">
          Consultez et gérez les commandes de vos clients.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Total commandes
          </p>
          <p className="mt-2 text-3xl font-black text-gray-900">
            {counts.all}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            En attente
          </p>
          <p className="mt-2 text-3xl font-black text-orange-600">
            {counts.pending}
          </p>
          <Link
            href="/admin/orders?status=pending"
            className="mt-1 inline-block text-xs font-bold text-orange-600 hover:underline"
          >
            Traiter →
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            En cours
          </p>
          <p className="mt-2 text-3xl font-black text-orange-600">
            {counts.confirmed + counts.processing + counts.shipped}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Livrées
          </p>
          <p className="mt-2 text-3xl font-black text-green-600">
            {counts.delivered}
          </p>
        </div>
      </div>

      {/* Filter tabs with counts */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
            !selectedStatus
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Toutes
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
              !selectedStatus
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {counts.all}
          </span>
        </Link>

        {statuses.map((status) => (
          <Link
            key={status}
            href={`/admin/orders?status=${status}`}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
              selectedStatus === status
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {statusLabels[status]}
            {counts[status] > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  selectedStatus === status
                    ? "bg-white/20 text-white"
                    : statusColors[status]
                }`}
              >
                {counts[status]}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Orders table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    Commande
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    Client
                  </th>
                  <th className="hidden px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500 md:table-cell">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-black text-gray-900 hover:text-orange-600"
                      >
                        #{order.id}
                      </Link>
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold text-gray-900">
                        {order.customer_name}
                      </p>
                      {order.customer_address && (
                        <p className="mt-1 max-w-[200px] truncate text-xs text-gray-500">
                          {order.customer_address}
                        </p>
                      )}
                    </td>

                    <td className="hidden px-6 py-5 md:table-cell">
                      <span className="text-sm font-medium text-gray-700">
                        {order.customer_phone}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-black text-gray-900">
                        {Number(order.total).toFixed(2)}
                        <span className="ml-1 text-xs text-gray-500">DT</span>
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${order.customer_phone}`}
                          aria-label="Appeler"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition hover:bg-orange-100"
                        >
                          <PhoneIcon />
                        </a>

                        {whatsapp && (
                          <a
                            href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                              `Bonjour ${order.customer_name}, concernant votre commande #${order.id}...`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600 transition hover:bg-green-100"
                          >
                            <WhatsappIcon />
                          </a>
                        )}

                        <Link
                          href={`/admin/orders/${order.id}`}
                          aria-label="Voir"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition hover:bg-gray-200"
                        >
                          <EyeIcon />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              🛒
            </div>

            <h2 className="mt-4 text-xl font-black text-gray-900">
              Aucune commande
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {selectedStatus
                ? `Aucune commande avec le statut "${statusLabels[selectedStatus]}".`
                : "Les commandes des clients apparaîtront ici."}
            </p>

            {selectedStatus && (
              <Link
                href="/admin/orders"
                className="mt-5 inline-flex rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
              >
                Voir toutes les commandes
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
        statusColors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}