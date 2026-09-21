"use client";

import { useState } from "react";
import { useCart, type CartProduct } from "./CartProvider";

type AddToCartButtonProps = {
  product: CartProduct;
  variant?: "card" | "detail";
  className?: string;
};

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
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

export default function AddToCartButton({
  product,
  variant = "card",
  className = "",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const base =
  variant === "detail"
    ? "flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-black"
    : "flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold";

  let colors: string;
  if (isOutOfStock) {
    colors = "cursor-not-allowed bg-gray-100 text-gray-400";
  } else if (justAdded) {
    colors = "bg-green-500 text-white shadow-lg shadow-green-500/25";
  } else if (variant === "detail") {
    colors =
      "bg-navy-800 text-white hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/25";
  } else {
    colors =
      "bg-navy-800 text-white hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/25";
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className={`${base} ${colors} transition-all duration-300 ${className}`}
    >
      {isOutOfStock ? (
        "Indisponible"
      ) : justAdded ? (
        <>
          <CheckIcon />
          Ajouté au panier
        </>
      ) : (
        <>
          <CartIcon />
          Ajouter au panier
        </>
      )}
    </button>
  );
}