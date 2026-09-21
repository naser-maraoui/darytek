import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/store/Navbar";
import TrackOrderClient from "@/components/store/TrackOrderClient";

export default async function TrackOrderPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <div className="min-h-screen bg-white">
      <Navbar categories={categories ?? []} />
      <TrackOrderClient />
    </div>
  );
}