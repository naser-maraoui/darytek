"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type CheckoutItem = {
  productId: number;
  quantity: number;
};

type CheckoutData = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  items: CheckoutItem[];
};

export async function createOrder(data: CheckoutData) {
  const supabase = await createClient();

  // Get current user if any (guests allowed — customer_id will be null)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Validate customer information
  if (!data.customerName.trim()) {
    return {
      success: false,
      error: "Veuillez entrer votre nom.",
    };
  }

  if (!data.customerPhone.trim()) {
    return {
      success: false,
      error: "Veuillez entrer votre numéro de téléphone.",
    };
  }

  if (!data.customerAddress.trim()) {
    return {
      success: false,
      error: "Veuillez entrer votre adresse.",
    };
  }

  if (!data.items.length) {
    return {
      success: false,
      error: "Votre panier est vide.",
    };
  }

  // Get real products and prices from Supabase
  const productIds = data.items.map((item) => item.productId);

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, stock, is_available")
    .in("id", productIds);

  if (productsError || !products) {
    return {
      success: false,
      error: "Impossible de récupérer les produits.",
    };
  }

  // Validate products and calculate total using DB prices
  let total = 0;

  const orderItems = [];

  for (const item of data.items) {
    const product = products.find(
      (product) => product.id === item.productId
    );

    if (!product) {
      return {
        success: false,
        error: "Un produit de votre panier n'existe plus.",
      };
    }

    if (!product.is_available) {
      return {
        success: false,
        error: `Le produit "${product.name}" n'est plus disponible.`,
      };
    }

    if (item.quantity <= 0) {
      return {
        success: false,
        error: "Quantité invalide.",
      };
    }

    if (item.quantity > product.stock) {
      return {
        success: false,
        error: `Stock insuffisant pour "${product.name}".`,
      };
    }

    total += Number(product.price) * item.quantity;

    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      quantity: item.quantity,
      price: product.price,
    });
  }

  // Create order — customer_id is null for guest checkout
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: user?.id ?? null,
      customer_name: data.customerName.trim(),
      customer_phone: data.customerPhone.trim(),
      customer_address: data.customerAddress.trim(),
      total,
      status: "pending",
      notes: data.notes.trim() || null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Order creation error:", orderError);

    return {
      success: false,
      error: "Impossible de créer la commande.",
    };
  }

  // Add order items
  const itemsToInsert = orderItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsError) {
    console.error("Order items creation error:", itemsError);

    // Remove the order if items couldn't be created
    await supabase.from("orders").delete().eq("id", order.id);

    return {
      success: false,
      error: "Impossible d'ajouter les produits à la commande.",
    };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  return {
    success: true,
    orderId: order.id,
  };
}