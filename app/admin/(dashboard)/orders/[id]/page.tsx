import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StatusSelector from "./StatusSelector";

type Props = {
  params: Promise<{ id: string }>;
};

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
function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function NoteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function PackageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
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

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login");
  }

  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id, customer_name, customer_phone, customer_address,
      total, status, notes, created_at
    `)
    .eq("id", orderId)
    .single();

  if (error || !order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select(`
      id, product_id, product_name, quantity, price, subtotal
    `)
    .eq("order_id", orderId)
    .order("id", { ascending: true });

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const cleanPhone = order.customer_phone.replace(/\D/g, "");
  const whatsappUrl = whatsapp
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Bonjour ${order.customer_name}, concernant votre commande #${order.id} chez ElectroMenage...`
      )}`
    : `https://wa.me/${cleanPhone}`;

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className="text-sm font-bold text-gray-500 hover:text-gray-900"
          >
            ← Retour aux commandes
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-gray-900">
                  Commande #{order.id}
                </h1>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    statusColors[order.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Passée le{" "}
                {new Date(order.created_at).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href={`tel:${order.customer_phone}`}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                <PhoneIcon />
                Appeler
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-600"
              >
                <WhatsappIcon />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ---------------- LEFT: Customer + Notes ---------------- */}
          <div className="space-y-6 lg:col-span-1">
            {/* Customer card */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b bg-gray-50 px-5 py-4">
                <UserIcon />
                <h2 className="text-sm font-black text-gray-900">
                  Informations client
                </h2>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Nom
                  </p>
                  <p className="mt-1 font-bold text-gray-900">
                    {order.customer_name}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Téléphone
                  </p>
                  <a
                    href={`tel:${order.customer_phone}`}
                    className="mt-1 block font-bold text-orange-600 hover:underline"
                  >
                    {order.customer_phone}
                  </a>
                </div>

                {order.customer_address && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Adresse
                    </p>
                    <div className="mt-1 flex items-start gap-2">
                      <MapPinIcon />
                      <p className="text-sm text-gray-700">
                        {order.customer_address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="overflow-hidden rounded-2xl border border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2 border-b border-yellow-200 px-5 py-4">
                  <NoteIcon />
                  <h2 className="text-sm font-black text-yellow-900">
                    Notes du client
                  </h2>
                </div>
                <div className="p-5">
                  <p className="whitespace-pre-line text-sm leading-6 text-yellow-900">
                    {order.notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ---------------- RIGHT: Items ---------------- */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="flex items-center justify-between border-b bg-gray-50 px-5 py-4">
                <div className="flex items-center gap-2">
                  <PackageIcon />
                  <h2 className="text-sm font-black text-gray-900">
                    Produits commandés
                  </h2>
                </div>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-black text-gray-600 ring-1 ring-gray-200">
                  {items?.length ?? 0} article
                  {(items?.length ?? 0) > 1 ? "s" : ""}
                </span>
              </div>

              <div className="divide-y">
                {items && items.length > 0 ? (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900">
                          {item.product_name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {Number(item.price).toFixed(2)} DT × {item.quantity}
                        </p>
                      </div>

                      <p className="flex-shrink-0 text-base font-black text-gray-900">
                        {Number(item.subtotal).toFixed(2)}
                        <span className="ml-1 text-xs font-bold text-gray-500">
                          DT
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-gray-500">
                    Aucun produit trouvé.
                  </div>
                )}
              </div>

              <div className="border-t bg-gray-50 p-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-black uppercase tracking-wider text-gray-600">
                    Total à payer
                  </span>
                  <span className="text-2xl font-black text-gray-900">
                    {Number(order.total).toFixed(2)}
                    <span className="ml-1 text-sm font-bold text-gray-500">
                      DT
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Status management ---------------- */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b bg-gray-50 px-5 py-4">
            <h2 className="text-sm font-black text-gray-900">
              Gestion de la commande
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Changez le statut pour informer le client de l&apos;avancement.
            </p>
          </div>

          <div className="p-5">
            <StatusSelector orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
      </div>
    </div>
  );
}