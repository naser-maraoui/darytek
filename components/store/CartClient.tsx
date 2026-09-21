"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";

// ---------- Icons ----------
function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function CartEmptyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
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

export default function CartClient() {
  const {
    items,
    itemCount,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  // =========================================================
  // EMPTY STATE
  // =========================================================
  if (items.length === 0) {
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
              <span className="font-semibold text-gray-900">Panier</span>
            </nav>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <CartEmptyIcon />
            </div>

            <h1 className="mt-6 text-2xl font-black text-gray-900 sm:text-3xl">
              Votre panier est vide
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
              Découvrez notre sélection d&apos;appareils électroménagers et
              ajoutez vos préférés au panier.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-black text-white transition hover:bg-orange-600"
            >
              Découvrir les produits
            </Link>

            {/* Trust strip */}
            <div className="mt-12 grid grid-cols-3 gap-3 border-t border-gray-100 pt-8">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <TruckIcon />
                <p className="text-[11px] font-bold text-gray-900">Livraison</p>
                <p className="text-[10px] text-gray-500">Toute la Tunisie</p>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <LockIcon />
                <p className="text-[11px] font-bold text-gray-900">Paiement</p>
                <p className="text-[10px] text-gray-500">À la livraison</p>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <ShieldIcon />
                <p className="text-[11px] font-bold text-gray-900">Garantie</p>
                <p className="text-[10px] text-gray-500">Produits vérifiés</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // CART WITH ITEMS
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
            <span className="font-semibold text-gray-900">Panier</span>
          </nav>
        </div>
      </section>

      {/* Header */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Mon panier
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                <span className="font-black text-gray-900">{itemCount}</span>{" "}
                article{itemCount > 1 ? "s" : ""} dans votre panier
              </p>
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
            >
              <TrashIcon />
              Vider le panier
            </button>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
          {/* ============ ITEMS LIST ============ */}
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.product.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:border-gray-200 hover:shadow-sm"
              >
                <div className="flex gap-4 p-4 sm:p-5">
                  {/* Image */}
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-b from-gray-50 to-white sm:h-28 sm:w-28"
                  >
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-contain p-2"
                        sizes="112px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-300">
                        No image
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="line-clamp-2 text-sm font-bold text-gray-900 transition hover:text-orange-600 sm:text-base"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-xs text-gray-500">
                          Prix unitaire :{" "}
                          <span className="font-semibold text-gray-700">
                            {item.product.price.toFixed(2)} DT
                          </span>
                        </p>
                      </div>

                      {/* Remove (desktop) */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label="Supprimer"
                        className="hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500 sm:flex"
                      >
                        <TrashIcon />
                      </button>
                    </div>

                    {/* Bottom row */}
                    <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                      {/* Quantity */}
                      <div className="flex items-center overflow-hidden rounded-xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.product.id)}
                          aria-label="Diminuer"
                          className="flex h-9 w-9 items-center justify-center text-lg font-bold text-gray-700 transition hover:bg-gray-50 active:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="min-w-10 border-x border-gray-200 px-2 text-center text-sm font-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.product.id)}
                          disabled={item.quantity >= item.product.stock}
                          aria-label="Augmenter"
                          className="flex h-9 w-9 items-center justify-center text-lg font-bold text-gray-700 transition hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-base font-black text-navy-900 sm:text-lg">
                          {(item.product.price * item.quantity).toFixed(2)}
                          <span className="ml-1 text-xs font-bold text-gray-500">
                            DT
                          </span>
                        </p>
                        {/* Remove (mobile) */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="mt-1 text-[11px] font-semibold text-red-500 transition hover:text-red-600 sm:hidden"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>

                    {/* Stock warning */}
                    {item.quantity >= item.product.stock && (
                      <p className="mt-2 text-[11px] font-semibold text-orange-600">
                        ⚠ Stock maximum atteint
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {/* Continue shopping (desktop) */}
            <Link
              href="/products"
              className="hidden items-center gap-2 px-2 py-3 text-sm font-bold text-gray-600 transition hover:text-orange-600 lg:inline-flex"
            >
              <ArrowLeft />
              Continuer mes achats
            </Link>
          </div>

          {/* ============ SUMMARY ============ */}
          <div>
            <div className="lg:sticky lg:top-32">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {/* Header */}
                <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                  <h2 className="flex items-center gap-2 text-base font-black text-gray-900">
                    <span className="h-1 w-1 rounded-full bg-orange-500" />
                    Résumé de la commande
                  </h2>
                </div>

                {/* Body */}
                <div className="space-y-3 p-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Sous-total ({itemCount} article
                      {itemCount > 1 ? "s" : ""})
                    </span>
                    <span className="font-bold text-gray-900">
                      {total.toFixed(2)} DT
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Livraison</span>
                    <span className="font-semibold text-green-600">
                      Calculée à l&apos;étape suivante
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
                  <p className="text-[11px] text-gray-400">
                    Taxes incluses. Frais de livraison calculés au paiement.
                  </p>

                  {/* CTA */}
                  <Link
                    href="/checkout"
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-black text-white transition hover:bg-orange-600"
                  >
                    <LockIcon />
                    Passer la commande
                  </Link>

                  <Link
                    href="/products"
                    className="block text-center text-xs font-bold text-gray-500 transition hover:text-orange-600"
                  >
                    ← Continuer mes achats
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="space-y-2.5 border-t border-gray-100 bg-gray-50 p-5">
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
                      <TruckIcon />
                    </div>
                    <div>
                      <p className="font-black text-gray-900">
                        Livraison partout en Tunisie
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Sous 24h à 72h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
                      <LockIcon />
                    </div>
                    <div>
                      <p className="font-black text-gray-900">
                        Paiement à la livraison
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Payez à la réception
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
                      <ShieldIcon />
                    </div>
                    <div>
                      <p className="font-black text-gray-900">
                        Produits garantis
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Vérifiés avant expédition
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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