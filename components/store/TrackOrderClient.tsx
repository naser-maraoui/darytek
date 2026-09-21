"use client";

import { useState } from "react";
import Link from "next/link";
import { trackOrder } from "@/app/track-order/actions";

type Order = {
  id: number;
  customer_name: string;
  customer_phone: string;
  total: number;
  status: string;
  created_at: string;
  order_items: {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
};

const statuses = [
  {
    key: "pending",
    label: "Commande reçue",
    description: "Votre commande a bien été enregistrée.",
  },
  {
    key: "confirmed",
    label: "Confirmée",
    description: "Notre équipe a confirmé votre commande par téléphone.",
  },
  {
    key: "processing",
    label: "En préparation",
    description: "Votre commande est en cours de préparation.",
  },
  {
    key: "shipped",
    label: "Expédiée",
    description: "Votre colis est en route vers votre adresse.",
  },
  {
    key: "delivered",
    label: "Livrée",
    description: "Votre commande a été livrée. Merci de votre confiance !",
  },
];

function getStatusIndex(status: string) {
  return statuses.findIndex((item) => item.key === status);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
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
function PackageIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
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
function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
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
function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// Status badge colors
function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "En attente" },
    confirmed: { bg: "bg-orange-100", text: "text-blue-800", label: "Confirmée" },
    processing: { bg: "bg-indigo-100", text: "text-indigo-800", label: "En préparation" },
    shipped: { bg: "bg-purple-100", text: "text-purple-800", label: "Expédiée" },
    delivered: { bg: "bg-green-100", text: "text-green-800", label: "Livrée" },
    cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Annulée" },
  };
  return (
    map[status] ?? { bg: "bg-gray-100", text: "text-gray-800", label: status }
  );
}

export default function TrackOrderClient() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const supportPhone = process.env.NEXT_PUBLIC_PHONE ?? "+216 XX XXX XXX";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const result = await trackOrder(orderId, phone);

      if (!result.success) {
        setError(result.error || "Commande introuvable.");
        setLoading(false);
        return;
      }

      setOrder(result.order as Order);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = order ? getStatusIndex(order.status) : -1;

  // Build WhatsApp message with order number if available
  const whatsappMessage = encodeURIComponent(
    order
      ? `Bonjour, je souhaite avoir des informations sur ma commande #${order.id}.`
      : "Bonjour, j'ai une question concernant ma commande."
  );
  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp}?text=${whatsappMessage}`
    : "#";

  return (
    <main className="bg-white">
      {/* Breadcrumb */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
            <Link href="/" className="hover:text-orange-600">
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900">
              Suivre ma commande
            </span>
          </nav>
        </div>
      </section>

      {/* Header */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
            <PackageIcon className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Suivre ma commande
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500">
            Entrez votre numéro de commande et le numéro de téléphone utilisé
            lors de la commande pour voir son état en temps réel.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FORM / NO ORDER YET                                              */}
      {/* ================================================================ */}
      {!order && (
        <section className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
            {/* Form */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                <h2 className="flex items-center gap-2 text-sm font-black text-gray-900">
                  <SearchIcon />
                  Rechercher une commande
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
                <div>
                  <label
                    htmlFor="orderId"
                    className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-700"
                  >
                    Numéro de commande *
                  </label>
                  <input
                    id="orderId"
                    type="text"
                    inputMode="numeric"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Ex: 123"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                  <p className="mt-1.5 text-[11px] text-gray-400">
                    Le numéro vous a été fourni après votre commande.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-700"
                  >
                    Numéro de téléphone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 20 123 456"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                  <p className="mt-1.5 text-[11px] text-gray-400">
                    Le numéro utilisé lors de la commande.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <AlertIcon />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-red-900">
                        Commande introuvable
                      </p>
                      <p className="mt-0.5 text-xs text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Recherche en cours...
                    </>
                  ) : (
                    <>
                      <SearchIcon />
                      Suivre ma commande
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Help sidebar */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                  <h3 className="text-sm font-black text-gray-900">
                    Besoin d&apos;aide ?
                  </h3>
                </div>
                <div className="space-y-4 p-5">
                  <p className="text-xs leading-6 text-gray-500">
                    Vous ne retrouvez pas votre numéro de commande ? Contactez
                    notre équipe, nous vous aiderons à le retrouver.
                  </p>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-xs font-black text-white transition hover:bg-green-600"
                  >
                    <WhatsappIcon />
                    Contacter sur WhatsApp
                  </a>

                  <a
                    href={`tel:${supportPhone}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3 text-xs font-black text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    <PhoneIcon />
                    {supportPhone}
                  </a>
                </div>
              </div>

              {/* Quick info */}
              <div className="rounded-2xl border border-gray-100 bg-orange-50 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-orange-700">
                  Info
                </p>
                <p className="mt-2 text-xs leading-6 text-blue-900">
                  Votre numéro de commande vous a été communiqué sur la page de
                  confirmation après votre achat. Vous le retrouverez aussi
                  dans notre appel de confirmation.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* ORDER RESULT                                                     */}
      {/* ================================================================ */}
      {order && (
        <section className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
            {/* LEFT: Timeline + items */}
            <div className="space-y-4">
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                    Commande
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-900">
                    #{order.id}
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Passée le {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${
                      statusBadge(order.status).bg
                    } ${statusBadge(order.status).text}`}
                  >
                    {statusBadge(order.status).label}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOrder(null);
                      setError("");
                      setOrderId("");
                      setPhone("");
                    }}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
                  >
                    Nouvelle recherche
                  </button>
                </div>
              </div>

              {/* Cancelled state */}
              {order.status === "cancelled" && (
                <div className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertIcon />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-red-900">
                      Commande annulée
                    </h3>
                    <p className="mt-1 text-xs leading-6 text-red-700">
                      Cette commande a été annulée. Si vous pensez qu&apos;il
                      s&apos;agit d&apos;une erreur, contactez-nous sur
                      WhatsApp.
                    </p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              {order.status !== "cancelled" && (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                    <h2 className="flex items-center gap-2 text-sm font-black text-gray-900">
                      <PackageIcon className="h-4 w-4" />
                      État de la commande
                    </h2>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="space-y-0">
                      {statuses.map((status, index) => {
                        const completed = index <= currentIndex;
                        const active = index === currentIndex;
                        const isLast = index === statuses.length - 1;

                        return (
                          <div
                            key={status.key}
                            className="relative flex gap-4"
                          >
                            {/* Vertical line */}
                            {!isLast && (
                              <div
                                className={`absolute left-[15px] top-9 h-full w-0.5 ${
                                  index < currentIndex
                                    ? "bg-green-500"
                                    : "bg-gray-200"
                                }`}
                              />
                            )}

                            {/* Circle */}
                            <div
                              className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-black ${
                                completed
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-100 text-gray-400 ring-4 ring-white"
                              }`}
                            >
                              {completed ? <CheckIcon /> : index + 1}
                            </div>

                            {/* Text */}
                            <div className={isLast ? "pb-0" : "pb-8"}>
                              <h3
                                className={`text-sm font-black ${
                                  active
                                    ? "text-orange-600"
                                    : completed
                                    ? "text-gray-900"
                                    : "text-gray-400"
                                }`}
                              >
                                {status.label}
                                {active && (
                                  <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black text-orange-700">
                                    Actuel
                                  </span>
                                )}
                              </h3>
                              <p
                                className={`mt-1 text-xs leading-6 ${
                                  active || completed
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                {status.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Order items */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
                  <h2 className="flex items-center gap-2 text-sm font-black text-gray-900">
                    <PackageIcon className="h-4 w-4" />
                    Produits commandés
                  </h2>
                  <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-[11px] font-black text-gray-700">
                    {order.order_items.length} article
                    {order.order_items.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 p-5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          {item.product_name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {Number(item.price).toFixed(2)} DT × {item.quantity}
                        </p>
                      </div>
                      <p className="flex-shrink-0 text-sm font-black text-gray-900">
                        {Number(item.subtotal).toFixed(2)}
                        <span className="ml-1 text-[10px] font-bold text-gray-500">
                          DT
                        </span>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-baseline justify-between border-t border-gray-100 bg-gray-50 p-5">
                  <span className="text-sm font-black text-gray-900">
                    Total à payer
                  </span>
                  <span className="text-2xl font-black tracking-tight text-navy-900">
                    {Number(order.total).toFixed(2)}
                    <span className="ml-1 text-sm font-bold text-gray-500">
                      DT
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Customer info + help */}
            <div>
              <div className="lg:sticky lg:top-32 space-y-4">
                {/* Customer info */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                    <h3 className="text-sm font-black text-gray-900">
                      Informations de livraison
                    </h3>
                  </div>
                  <div className="space-y-3 p-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        Nom
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-gray-900">
                        {order.customer_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        Téléphone
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-gray-900">
                        {order.customer_phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Help */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                    <h3 className="text-sm font-black text-gray-900">
                      Une question ?
                    </h3>
                  </div>
                  <div className="space-y-3 p-5">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-xs font-black text-white transition hover:bg-green-600"
                    >
                      <WhatsappIcon />
                      Contacter sur WhatsApp
                    </a>

                    <a
                      href={`tel:${supportPhone}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3 text-xs font-black text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                    >
                      <PhoneIcon />
                      {supportPhone}
                    </a>
                  </div>
                </div>

                {/* Continue shopping */}
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 transition hover:text-orange-600"
                >
                  ← Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ FOOTER ============ */}
      <footer className="mt-12 border-t border-gray-100 bg-white">
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
              <Link href="/cart" className="hover:text-orange-600">
                Panier
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}