import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/store/Navbar";
import CheckoutClient from "@/components/store/CheckoutClient";

export default async function CheckoutPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <div className="min-h-screen bg-white">
      <Navbar categories={categories ?? []} />
      <CheckoutClient />
    </div>
  );
}