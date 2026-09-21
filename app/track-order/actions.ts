"use server";

import { createClient } from "@/lib/supabase/server";

export async function trackOrder(orderId: string, phone: string) {
  const supabase = await createClient();

  const cleanPhone = phone.trim();

  if (!orderId.trim()) {
    return {
      success: false,
      error: "Veuillez entrer le numéro de commande.",
    };
  }

  if (!cleanPhone) {
    return {
      success: false,
      error: "Veuillez entrer votre numéro de téléphone.",
    };
  }

  const numericOrderId = Number(orderId);

  if (!Number.isInteger(numericOrderId) || numericOrderId <= 0) {
    return {
      success: false,
      error: "Numéro de commande invalide.",
    };
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id,
      customer_name,
      customer_phone,
      total,
      status,
      created_at,
      order_items (
        id,
        product_name,
        quantity,
        price,
        subtotal
      )
    `)
    .eq("id", numericOrderId)
    .eq("customer_phone", cleanPhone)
    .single();

  if (error || !order) {
    return {
      success: false,
      error:
        "Commande introuvable. Vérifiez le numéro de commande et le téléphone.",
    };
  }

  return {
    success: true,
    order,
  };
}
