"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
function AlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;
  const supabase = createClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategory() {
      const { data, error } = await supabase
        .from("categories")
        .select("name, description, is_active, image_url")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("Catégorie introuvable.");
        setLoading(false);
        return;
      }

      setName(data.name);
      setDescription(data.description || "");
      setIsActive(data.is_active);
      setCurrentImageUrl(data.image_url || null);

      if (data.image_url) {
        const marker = "/product-images/";
        if (data.image_url.includes(marker)) {
          setCurrentImagePath(data.image_url.split(marker)[1]);
        }
      }

      setLoading(false);
    }

    loadCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

    setSaving(true);

    try {
      const slug = createSlug(name);

      let newImageUrl = currentImageUrl;
      let newImagePath: string | null = null;

      // Upload new image if selected
      if (imageFile) {
        const extension =
          imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

        newImagePath = `categories/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(newImagePath, imageFile, {
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
          .getPublicUrl(newImagePath);

        newImageUrl = data.publicUrl;
      }

      // Update category
      const { error: updateError } = await supabase
        .from("categories")
        .update({
          name: name.trim(),
          slug,
          description: description.trim() || null,
          image_url: newImageUrl,
          is_active: isActive,
        })
        .eq("id", id);

      if (updateError) {
        // Remove newly uploaded image if database update fails
        if (newImagePath) {
          await supabase.storage
            .from("product-images")
            .remove([newImagePath]);
        }

        if (updateError.code === "23505") {
          setError("Une catégorie avec ce nom existe déjà.");
        } else {
          setError(updateError.message);
        }

        setSaving(false);
        return;
      }

      // Delete old image after successful update
      if (
        imageFile &&
        currentImagePath &&
        currentImagePath !== newImagePath
      ) {
        await supabase.storage
          .from("product-images")
          .remove([currentImagePath]);
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est définitive."
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(
        "Impossible de supprimer cette catégorie. Vérifiez qu'elle n'est pas utilisée par des produits."
      );
      setDeleting(false);
      return;
    }

    if (currentImagePath) {
      await supabase.storage
        .from("product-images")
        .remove([currentImagePath]);
    }

    router.push("/admin/categories");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="mx-auto max-w-2xl animate-pulse space-y-4">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-8 w-64 rounded bg-gray-200" />
          <div className="h-96 rounded-2xl bg-white shadow-sm" />
        </div>
      </div>
    );
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
            Modifier la catégorie
          </h1>

          <p className="mt-2 text-gray-500">
            Modifiez les informations de cette catégorie.
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
              disabled={saving || deleting}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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

            {/* Current / new preview */}
            {(imagePreview || currentImageUrl) && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-bold text-gray-700">
                  {imagePreview ? "Nouvelle image" : "Image actuelle"}
                </p>

                <div className="relative h-56 w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={imagePreview || currentImageUrl || ""}
                    alt={name}
                    fill
                    className="object-cover"
                    unoptimized={!!imagePreview}
                  />
                </div>
              </div>
            )}

            <div className="rounded-2xl border-2 border-dashed border-gray-300 p-5 transition hover:border-blue-400">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={saving || deleting}
                className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-gray-800"
              />

              <p className="mt-2 text-[11px] text-gray-400">
                JPG, PNG ou WEBP — max 5 MB. Laissez vide pour conserver
                l&apos;image actuelle.
              </p>
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
              disabled={saving || deleting}
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
              disabled={saving || deleting}
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

          {/* Save / Cancel */}
          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving || deleting}
              className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving || deleting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving && <Spinner />}
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border-2 border-red-100 bg-red-50/40 p-5">
            <h2 className="text-sm font-black text-red-900">
              Zone dangereuse
            </h2>
            <p className="mt-1 text-xs leading-5 text-red-700">
              La suppression de la catégorie est définitive. Assurez-vous
              qu&apos;aucun produit n&apos;y est associé.
            </p>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? <Spinner /> : <TrashIcon />}
              {deleting ? "Suppression..." : "Supprimer la catégorie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}