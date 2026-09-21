"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: number;
  name: string;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function validateImage(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG and WEBP images are allowed.";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Image size must be less than 5 MB.";
  }
  return null;
}

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [isPromo, setIsPromo] = useState(false);
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("name");

      if (error) {
        setError(error.message);
      } else {
        setCategories(data || []);
      }

      setLoadingCategories(false);
    }

    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const valid: File[] = [];
    for (const file of files) {
      const err = validateImage(file);
      if (err) {
        setError(err);
        continue;
      }
      valid.push(file);
    }

    setImageFiles((prev) => [...prev, ...valid]);
    setImagePreviews((prev) => [
      ...prev,
      ...valid.map((f) => URL.createObjectURL(f)),
    ]);

    e.target.value = "";
  }

  function removeNewImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!price || Number(price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (isPromo) {
      if (!compareAtPrice || Number(compareAtPrice) <= 0) {
        setError("Veuillez saisir un ancien prix valide.");
        return;
      }
      if (Number(compareAtPrice) <= Number(price)) {
        setError("L'ancien prix doit être supérieur au prix actuel.");
        return;
      }
    }

    if (!stock || Number(stock) < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    setLoading(true);

    try {
      // Upload all images
      const uploadedUrls: string[] = [];

      for (const file of imageFiles) {
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const filePath = `products/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) throw new Error(uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      const slug =
        name
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") +
        "-" +
        Date.now();

      const { error: insertError } = await supabase
        .from("products")
        .insert({
          name: name.trim(),
          slug,
          description: description.trim() || null,
          price: Number(price),
          compare_at_price: isPromo ? Number(compareAtPrice) : null,
          category_id: Number(categoryId),
          image_url: uploadedUrls[0] ?? null,
          images: uploadedUrls,
          stock: Number(stock),
          is_available: isAvailable,
          is_featured: isFeatured,
        });

      if (insertError) {
        console.error("Product insert failed:", insertError);
        throw new Error(insertError.message);
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="mb-4 text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            ← Back to products
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>

          <p className="mt-2 text-gray-600">
            Add a new product to your store.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
        >
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Product name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Product name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Starsat SR-2000 HD"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              disabled={loading || loadingCategories}
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select a category"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price + Stock */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Prix actuel (DT) *
                {isPromo && (
                  <span className="ml-1 text-orange-600">
                    (prix promotionnel)
                  </span>
                )}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                disabled={loading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Stock
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                disabled={loading}
              />
            </div>
          </div>

          {/* Promotion */}
          <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/50 p-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={isPromo}
                onChange={(e) => {
                  setIsPromo(e.target.checked);
                  if (!e.target.checked) setCompareAtPrice("");
                }}
                disabled={loading}
                className="mt-1 h-5 w-5 rounded accent-orange-600"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  🔥 Mettre en promotion
                </p>
                <p className="mt-0.5 text-sm text-gray-600">
                  Afficher un prix barré et un badge de réduction sur la
                  boutique.
                </p>
              </div>
            </label>

            {isPromo && (
              <div className="mt-5 border-t border-orange-200 pt-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Ancien prix (prix barré) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="Ex: 150.00"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  disabled={loading}
                />

                {price &&
                  compareAtPrice &&
                  Number(compareAtPrice) > Number(price) && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-black text-white">
                      🔥 -
                      {Math.round(
                        ((Number(compareAtPrice) - Number(price)) /
                          Number(compareAtPrice)) *
                          100
                      )}
                      % de réduction
                    </div>
                  )}
                {price &&
                  compareAtPrice &&
                  Number(compareAtPrice) <= Number(price) && (
                    <p className="mt-3 text-xs font-semibold text-red-600">
                      ⚠ L&apos;ancien prix doit être supérieur au prix actuel.
                    </p>
                  )}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product..."
              rows={5}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              disabled={loading}
            />
          </div>

          {/* Images */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Images du produit
              <span className="ml-1 text-xs font-normal text-gray-400">
                (la première sera l&apos;image principale)
              </span>
            </label>

            {imagePreviews.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {imagePreviews.map((url, i) => (
                  <div
                    key={`new-${i}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-blue-300 bg-orange-50/40"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Nouvelle ${i + 1}`}
                      className="h-full w-full object-contain p-2"
                    />
                    {i === 0 && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-orange-500 px-2 py-0.5 text-[9px] font-black text-white">
                        Principale
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      aria-label="Retirer"
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-sm text-white opacity-0 transition group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-xl border-2 border-dashed border-gray-300 p-5 transition hover:border-blue-400">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImagesChange}
                disabled={loading}
                className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-gray-800"
              />
              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG ou WEBP — maximum 5 MB par image. Vous pouvez en
                sélectionner plusieurs à la fois.
              </p>
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-xl border bg-gray-50 p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                disabled={loading}
                className="h-5 w-5 rounded"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  Product available
                </p>
                <p className="text-sm text-gray-500">
                  Customers can see this product in the store.
                </p>
              </div>
            </label>
          </div>

          {/* Featured */}
          <div className="rounded-xl border bg-gray-50 p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                disabled={loading}
                className="h-5 w-5 rounded"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  Featured product
                </p>
                <p className="text-sm text-gray-500">
                  Show this product on the homepage.
                </p>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              disabled={loading}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Adding product..." : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}