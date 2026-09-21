"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import QuickViewModal from "./QuickViewModal";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image_url: string | null;
  is_available: boolean;
  compare_at_price?: number | null;
  brand?: string | null;
  categories:
    | {
        name: string;
        slug: string;
      }[]
    | null;
};

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const category = product.categories?.[0];
  const isOutOfStock = product.stock <= 0;
  const isAvailable = product.is_available && !isOutOfStock;

  const hasPromo =
    product.compare_at_price != null &&
    product.compare_at_price > product.price;

  const discountPct = hasPromo
    ? Math.round(
        ((product.compare_at_price! - product.price) /
          product.compare_at_price!) *
          100
      )
    : 0;

  const price = Number(product.price);
  const oldPrice = hasPromo ? Number(product.compare_at_price) : null;

  return (
    <>
      <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_18px_35px_-15px_rgba(0,0,0,0.15)]">
        {/* IMAGE — square now, minimal padding */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <Link
            href={`/products/${product.slug}`}
            className="relative block h-full w-full"
          >
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className={`object-contain p-2 transition-transform duration-500 group-hover:scale-110 ${
                  isOutOfStock ? "opacity-50 grayscale" : ""
                }`}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-300">
                Aucune image
              </div>
            )}
          </Link>

          {/* Badges */}
          <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col gap-1">
            {hasPromo && isAvailable && (
              <span className="inline-flex items-center rounded-md bg-gradient-to-r from-red-500 to-red-600 px-2 py-0.5 text-[11px] font-black text-white shadow-sm">
                -{discountPct}%
              </span>
            )}
            {isOutOfStock && (
              <span className="inline-flex items-center rounded-md bg-gray-900 px-2 py-0.5 text-[11px] font-bold text-white">
                Rupture
              </span>
            )}
          </div>

          {/* Quick View button */}
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            aria-label="Aperçu rapide"
            className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-500 opacity-0 shadow-md backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-orange-500 hover:text-white group-hover:opacity-100"
          >
            <EyeIcon />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col p-3">
          {category && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              {category.name}
            </span>
          )}

          <Link href={`/products/${product.slug}`} className="mt-1 block">
            <h3 className="line-clamp-2 min-h-[36px] text-[13px] font-semibold leading-[18px] text-gray-900 transition-colors group-hover:text-orange-600">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span
              className={`text-base font-black tracking-tight ${
                hasPromo ? "text-red-600" : "text-gray-950"
              }`}
            >
              {price.toFixed(2)}
              <span className="ml-1 text-[10px] font-bold text-gray-500">
                DT
              </span>
            </span>
            {oldPrice && (
              <span className="text-[10px] font-medium text-gray-400 line-through">
                {oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                isAvailable ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span
              className={`text-[11px] font-medium ${
                isAvailable ? "text-green-700" : "text-red-600"
              }`}
            >
              {isAvailable ? "En stock" : "Indisponible"}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-3">
            <AddToCartButton product={product} variant="card" />
          </div>
        </div>
      </article>

      {quickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}