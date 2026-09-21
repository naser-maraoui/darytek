import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ---------- Icons ----------
function FolderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function XCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
function PackageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export default async function CategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login");
  }

  // Fetch categories with product counts
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*, products (id)")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const total = categories?.length ?? 0;
  const activeCount = categories?.filter((c) => c.is_active).length ?? 0;
  const inactiveCount = total - activeCount;

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Catégories</h1>
          <p className="mt-2 text-gray-500">
            Gérez les catégories de vos produits.
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
        >
          <PlusIcon />
          Ajouter une catégorie
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <FolderIcon />
            </div>
          </div>
          <p className="mt-2 text-3xl font-black text-gray-900">{total}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Actives
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircleIcon />
            </div>
          </div>
          <p className="mt-2 text-3xl font-black text-green-600">
            {activeCount}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Inactives
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <XCircleIcon />
            </div>
          </div>
          <p className="mt-2 text-3xl font-black text-gray-400">
            {inactiveCount}
          </p>
        </div>
      </div>

      {/* Categories table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {categories && categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    Catégorie
                  </th>
                  <th className="hidden px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500 md:table-cell">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    Produits
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {categories.map((category) => {
                  const productCount = category.products?.length ?? 0;

                  return (
                    <tr
                      key={category.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                            {category.image_url ? (
                              <Image
                                src={category.image_url}
                                alt={category.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-300">
                                <FolderIcon />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-gray-900">
                              {category.name}
                            </p>

                            {category.description && (
                              <p className="mt-0.5 max-w-md truncate text-xs text-gray-500">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="hidden px-6 py-4 md:table-cell">
                        <code className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-600">
                          {category.slug}
                        </code>
                      </td>

                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                          <PackageIcon />
                          {productCount}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {category.is_active ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 transition hover:bg-orange-100"
                        >
                          <EditIcon />
                          Modifier
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <FolderIcon />
            </div>

            <h2 className="mt-4 text-xl font-black text-gray-900">
              Aucune catégorie
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Commencez par créer votre première catégorie.
            </p>

            <Link
              href="/admin/categories/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              <PlusIcon />
              Ajouter une catégorie
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}