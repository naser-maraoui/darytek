"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AddToCartButton from "./AddToCartButton";
import ImageGallery from "./ImageGallery";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image_url: string | null;
  is_available: boolean;
  compare_at_price?: number | null;
  description?: string | null;
  images?: string[] | null;
  categories: { name: string; slug: string }[] | null;
};

type Props = {
  product: Product;
  onClose: () => void;
};

// ---------- Icons ----------
function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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
function TruckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}

export default function QuickViewModal({ product, onClose }: Props) {
  const [description, setDescription] = useState<string | null>(
    product.description ?? null
  );
  const [images, setImages] = useState<string[]>(product.images ?? []);
  const [loadingExtras, setLoadingExtras] = useState(
    product.description === undefined || product.images === undefined
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    if (product.description !== undefined && product.images !== undefined) {
      return;
    }
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("description, images")
        .eq("id", product.id)
        .single();
      if (!cancelled && data) {
        if (product.description === undefined) {
          setDescription(data.description);
        }
        if (product.images === undefined) {
          setImages(data.images ?? []);
        }
      }
      if (!cancelled) setLoadingExtras(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [product.id, product.description, product.images]);

  const category = product.categories?.[0];
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
    images.length > 0
      ? images
      : product.image_url
      ? [product.image_url]
      : [];

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-md backdrop-blur transition hover:bg-gray-100 hover:text-gray-900"
        >
          <CloseIcon />
        </button>

        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2 md:gap-8">
          {/* IMAGE GALLERY */}
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
                  {isOutOfStock && (
                    <span className="absolute left-4 top-4 z-10 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-black text-white">
                      Rupture
                    </span>
                  )}
                </>
              }
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col">
            {category && (
              <span className="text-[11px] font-black uppercase tracking-widest text-orange-600">
                {category.name}
              </span>
            )}

            <h2
              id="quickview-title"
              className="mt-2 text-xl font-black leading-tight text-gray-900 sm:text-2xl"
            >
              {product.name}
            </h2>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span
                className={`text-3xl font-black tracking-tight ${
                  hasPromo ? "text-red-600" : "text-navy-900"
                }`}
              >
                {Number(product.price).toFixed(2)}
                <span className="ml-1 text-base font-bold text-gray-500">
                  DT
                </span>
              </span>
              {hasPromo && (
                <span className="text-sm font-medium text-gray-400 line-through">
                  {Number(product.compare_at_price).toFixed(2)} DT
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  isAvailable ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span
                className={`text-xs font-bold ${
                  isAvailable ? "text-green-700" : "text-red-600"
                }`}
              >
                {isAvailable
                  ? `En stock (${product.stock} disponible${
                      product.stock > 1 ? "s" : ""
                    })`
                  : "Indisponible"}
              </span>
            </div>

            {loadingExtras ? (
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-4/6 animate-pulse rounded bg-gray-100" />
              </div>
            ) : description ? (
              <p className="mt-4 line-clamp-4 text-sm leading-6 text-gray-600">
                {description}
              </p>
            ) : null}

            <div className="mt-4 grid grid-cols-3 gap-2 border-y border-gray-100 py-3">
              <div className="flex flex-col items-center gap-1 text-center">
                <TruckIcon />
                <span className="text-[10px] font-bold text-gray-600">
                  Livraison TN
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <CashIcon />
                <span className="text-[10px] font-bold text-gray-600">
                  Paiement livr.
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <ShieldIcon />
                <span className="text-[10px] font-bold text-gray-600">
                  Garanti
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {isAvailable && (
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
              )}

              <Link
                href={`/products/${product.slug}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3.5 text-sm font-black text-gray-800 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Voir tous les détails
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}