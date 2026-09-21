"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { createOrder } from "@/app/checkout/actions";

// ---------- useIsClient (hydration-safe) ----------
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// ---------- Icons ----------
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}
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
function CashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
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
function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function ArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
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
function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export default function CheckoutClient() {
  const router = useRouter();
  const isClient = useIsClient();
  const { items, itemCount, total, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createOrder({
        customerName,
        customerPhone,
        customerAddress,
        notes,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      if (!result.success) {
        setError(result.error || "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      clearCart();
      router.push(`/checkout/success?order=${result.orderId}`);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  // =========================================================
  // LOADING SKELETON (before client mount)
  // =========================================================
  if (!isClient) {
    return (
      <main className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto max-w-md animate-pulse space-y-4">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-100" />
            <div className="mx-auto h-6 w-56 rounded bg-gray-100" />
            <div className="mx-auto h-4 w-72 rounded bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // EMPTY CART
  // =========================================================
  if (items.length === 0) {
    return (
      <main className="bg-white">
        <section className="border-b border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <nav className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
              <Link href="/" className="hover:text-orange-600">
                Accueil
              </Link>
              <span className="text-gray-300">/</span>
              <span className="font-semibold text-gray-900">Commande</span>
            </nav>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-4xl">
              🛒
            </div>
            <h1 className="mt-6 text-2xl font-black text-gray-900 sm:text-3xl">
              Aucun article à commander
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
              Ajoutez des produits à votre panier avant de finaliser votre
              commande.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-black text-white transition hover:bg-orange-600"
            >
              Découvrir les produits
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // MAIN CHECKOUT
  // =========================================================
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
            <Link href="/cart" className="hover:text-orange-600">
              Panier
            </Link>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900">Commande</span>
          </nav>
        </div>
      </section>

      {/* Progress steps */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-black text-white">
                ✓
              </div>
              <span className="hidden text-xs font-bold text-gray-900 sm:inline">
                Panier
              </span>
            </div>
            <div className="h-px w-8 bg-gray-200 sm:w-16" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-black text-white">
                2
              </div>
              <span className="text-xs font-bold text-orange-600">
                Livraison
              </span>
            </div>
            <div className="h-px w-8 bg-gray-200 sm:w-16" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-400">
                3
              </div>
              <span className="hidden text-xs font-bold text-gray-400 sm:inline">
                Confirmation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Header */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 transition hover:text-orange-600"
          >
            <ArrowLeft />
            Retour au panier
          </Link>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Finaliser la commande
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Remplissez vos informations pour recevoir votre commande.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-10">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
            {/* ============ LEFT: FORM ============ */}
            <div className="space-y-4">
              {/* Info block */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white">
                    1
                  </span>
                  <h2 className="text-sm font-black text-gray-900">
                    Informations de livraison
                  </h2>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="customerName"
                      className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-700"
                    >
                      <UserIcon />
                      Nom complet *
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Ahmed Ben Ali"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="customerPhone"
                      className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-700"
                    >
                      <PhoneIcon />
                      Numéro de téléphone *
                    </label>
                    <input
                      id="customerPhone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ex: 20 123 456"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                    <p className="mt-1.5 text-[11px] text-gray-400">
                      Nous vous appellerons pour confirmer votre commande.
                    </p>
                  </div>

                  {/* Address */}
                  <div>
                    <label
                      htmlFor="customerAddress"
                      className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-700"
                    >
                      <MapPinIcon />
                      Adresse de livraison *
                    </label>
                    <textarea
                      id="customerAddress"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Ex: Rue 18 Janvier, Immeuble 5, Appartement 12, Tunis"
                      required
                      rows={3}
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                    <p className="mt-1.5 text-[11px] text-gray-400">
                      Précisez la ville, la rue et tout détail utile (étage,
                      code).
                    </p>
                  </div>

                  {/* Notes */}
                  <div>
                    <label
                      htmlFor="notes"
                      className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-700"
                    >
                      <NoteIcon />
                      Notes (facultatif)
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Livrer après 18h, ou toute instruction spéciale"
                      rows={2}
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>
              </div>

              {/* Payment method block */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white">
                    2
                  </span>
                  <h2 className="text-sm font-black text-gray-900">
                    Mode de paiement
                  </h2>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3 rounded-xl border-2 border-orange-500 bg-orange-50/50 p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                      <CashIcon />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-gray-900">
                          Paiement à la livraison
                        </p>
                        <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white">
                          Recommandé
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-gray-600">
                        Payez en espèces au livreur à la réception de votre
                        commande. Aucun pré-paiement n&apos;est nécessaire.
                      </p>
                    </div>
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-500">
                      <span className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertIcon />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-red-900">
                      Erreur lors de la commande
                    </p>
                    <p className="mt-0.5 text-xs text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Mobile confirm button (shows below form on mobile) */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <LockIcon />
                      Confirmer la commande ({total.toFixed(2)} DT)
                    </>
                  )}
                </button>
                <p className="mt-2 text-center text-[11px] text-gray-400">
                  En confirmant, vous acceptez d&apos;être contacté par
                  téléphone.
                </p>
              </div>
            </div>

            {/* ============ RIGHT: SUMMARY ============ */}
            <div>
              <div className="lg:sticky lg:top-32">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
                    <h2 className="flex items-center gap-2 text-sm font-black text-gray-900">
                      <span className="h-1 w-1 rounded-full bg-orange-500" />
                      Votre commande
                    </h2>
                    <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-[11px] font-black text-gray-700">
                      {itemCount} article{itemCount > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className="max-h-72 overflow-y-auto px-5 py-4">
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-start gap-3"
                        >
                          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                            {item.product.image_url ? (
                              <Image
                                src={item.product.image_url}
                                alt={item.product.name}
                                fill
                                sizes="56px"
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[10px] text-gray-300">
                                -
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-xs font-bold text-gray-900">
                              {item.product.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-gray-500">
                              × {item.quantity}
                            </p>
                          </div>
                          <span className="flex-shrink-0 text-xs font-black text-gray-900">
                            {(item.product.price * item.quantity).toFixed(2)} DT
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 border-t border-gray-100 p-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Sous-total</span>
                      <span className="font-bold text-gray-900">
                        {total.toFixed(2)} DT
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Livraison</span>
                      <span className="font-semibold text-green-600">
                        Calculée à la livraison
                      </span>
                    </div>
                    <div className="my-1 border-t border-dashed border-gray-200" />
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-black text-gray-900">
                        Total à payer
                      </span>
                      <span className="text-2xl font-black tracking-tight text-navy-900">
                        {total.toFixed(2)}
                        <span className="ml-1 text-sm font-bold text-gray-500">
                          DT
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* CTA (desktop) */}
                  <div className="hidden border-t border-gray-100 p-5 lg:block">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {loading ? (
                        <>
                          <Spinner />
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          <LockIcon />
                          Confirmer la commande
                        </>
                      )}
                    </button>
                    <p className="mt-2 text-center text-[11px] text-gray-400">
                      Vous serez contacté pour confirmer votre commande.
                    </p>
                  </div>

                  {/* Trust badges */}
                  <div className="space-y-2.5 border-t border-gray-100 bg-gray-50 p-5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
                        <TruckIcon />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-gray-900">
                          Livraison rapide
                        </p>
                        <p className="text-[10px] text-gray-500">
                          24h à 72h partout en Tunisie
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
                        <CashIcon />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-gray-900">
                          Paiement à la livraison
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Aucun pré-paiement
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
                        <ShieldIcon />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-gray-900">
                          Produits garantis
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Vérifiés avant expédition
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue shopping */}
                <Link
                  href="/products"
                  className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 transition hover:text-orange-600"
                >
                  <ArrowLeft />
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        </form>
      </section>

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