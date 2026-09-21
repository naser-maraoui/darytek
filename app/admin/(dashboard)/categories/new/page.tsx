"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// ---------- Icons ----------
function ArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
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

export default function NewCategoryPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");

    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("L'image doit être au format JPG, PNG ou WEBP.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("L'image doit faire moins de 5 MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Le nom de la catégorie est obligatoire.");
      return;
    }

    setLoading(true);

    try {
      const slug = createSlug(name);
      let imageUrl: string | null = null;

      // Upload image
      if (imageFile) {
        const extension =
          imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

        const filePath = `categories/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile, {
            contentType: imageFile.type,
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(
            `Erreur lors de l'upload de l'image : ${uploadError.message}`
          );
        }

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      // Create category
      const { error: insertError } = await supabase
        .from("categories")
        .insert({
          name: name.trim(),
          slug,
          description: description.trim() || null,
          image_url: imageUrl,
          is_active: isActive,
        });

      if (insertError) {
        // If database insertion fails, remove uploaded image
        if (imageFile && imageUrl) {
          const path = imageUrl.split("/product-images/")[1];
          if (path) {
            await supabase.storage.from("product-images").remove([path]);
          }
        }

        if (insertError.code === "23505") {
          setError("Cette catégorie existe déjà.");
        } else {
          setError(insertError.message);
        }

        setLoading(false);
        return;
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
      setLoading(false);
    }
  }

  const generatedSlug = name ? createSlug(name) : "";

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft />
            Retour
          </button>

          <h1 className="text-3xl font-black text-gray-900">
            Ajouter une catégorie
          </h1>

          <p className="mt-2 text-gray-500">
            Créez une nouvelle catégorie pour vos produits.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white p-6 shadow-sm md:p-8"
        >
          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertIcon />
              </div>
              <p className="mt-1 text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-700">
              Nom de la catégorie *
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Récepteurs"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              disabled={loading}
            />

            {generatedSlug && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Slug
                </span>
                <code className="text-xs font-bold text-gray-700">
                  {generatedSlug}
                </code>
              </div>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-700">
              Image de la catégorie
            </label>

            <div className="rounded-2xl border-2 border-dashed border-gray-300 p-5 transition hover:border-blue-400">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={loading}
                className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-gray-800"
              />

              <p className="mt-2 text-[11px] text-gray-400">
                JPG, PNG ou WEBP — maximum 5 MB
              </p>

              {imagePreview && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-bold text-gray-700">
                    Aperçu
                  </p>

                  <div className="relative h-56 w-full overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={imagePreview}
                      alt="Aperçu de la catégorie"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la catégorie..."
              rows={4}
              disabled={loading}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div>
              <p className="text-sm font-black text-gray-900">
                Catégorie active
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Les clients pourront voir cette catégorie.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              disabled={loading}
              className={`relative h-7 w-12 flex-shrink-0 rounded-full transition disabled:opacity-50 ${
                isActive ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  isActive ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Spinner />}
              {loading ? "Création..." : "Créer la catégorie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}