"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: number | null;
  image_url: string | null;
  images: string[] | null;
  stock: number;
  is_available: boolean;
  is_featured: boolean;
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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const supabase = createClient();
  const productId = Number(params.id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [isPromo, setIsPromo] = useState(false);
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!productId || Number.isNaN(productId)) {
        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      const [
        { data: productData, error: productError },
        { data: categoriesData, error: categoriesError },
      ] = await Promise.all([
        supabase.from("products").select("*").eq("id", productId).single(),
        supabase
          .from("categories")
          .select("id, name")
          .eq("is_active", true)
          .order("name"),
      ]);

      if (productError) {
        setError(productError.message);
        setLoading(false);
        return;
      }

      if (categoriesError) {
        setError(categoriesError.message);
        setLoading(false);
        return;
      }

      if (!productData) {
        setError("Product not found.");
        setLoading(false);
        return;
      }

      setProduct(productData);
      setName(productData.name || "");
      setCategoryId(
        productData.category_id ? String(productData.category_id) : ""
      );
      setPrice(String(productData.price ?? ""));
      setStock(String(productData.stock ?? ""));
      setDescription(productData.description || "");

      const hasPromo =
        productData.compare_at_price != null &&
        Number(productData.compare_at_price) > Number(productData.price);
      setIsPromo(hasPromo);
      setCompareAtPrice(hasPromo ? String(productData.compare_at_price) : "");

      // Load existing images
      const initialImages =
        productData.images && productData.images.length > 0
          ? productData.images
          : productData.image_url
          ? [productData.image_url]
          : [];
      setExistingImages(initialImages);

      setIsAvailable(productData.is_available);
      setIsFeatured(productData.is_featured);
      setCategories(categoriesData || []);
      setLoading(false);
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

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

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  }

  function getStoragePathFromUrl(url: string) {
    const marker = "/storage/v1/object/public/product-images/";
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return decodeURIComponent(url.substring(index + marker.length));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!product) {
      setError("Product not found.");
      return;
    }

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

    setSaving(true);

    try {
      // Upload new images
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

      const finalImages = [...existingImages, ...uploadedUrls];
      const primaryImage = finalImages[0] ?? null;

      // Find removed images (were in product.images, not in existingImages)
      const originalImages =
        product.images && product.images.length > 0
          ? product.images
          : product.image_url
          ? [product.image_url]
          : [];

      const removedImages = originalImages.filter(
        (url) => !existingImages.includes(url)
      );

      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: name.trim(),
          description: description.trim() || null,
          price: Number(price),
          compare_at_price: isPromo ? Number(compareAtPrice) : null,
          category_id: Number(categoryId),
          image_url: primaryImage,
          images: finalImages,
          stock: Number(stock),
          is_available: isAvailable,
          is_featured: isFeatured,
        })
        .eq("id", productId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Delete removed images from storage (best-effort)
      if (removedImages.length > 0) {
        const paths = removedImages
          .map((url) => getStoragePathFromUrl(url))
          .filter(Boolean) as string[];

        if (paths.length > 0) {
          await supabase.storage.from("product-images").remove(paths);
        }
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
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!product) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );
    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      if (existingImages.length > 0) {
        const paths = existingImages
          .map((url) => getStoragePathFromUrl(url))
          .filter(Boolean) as string[];

        if (paths.length > 0) {
          await supabase.storage.from("product-images").remove(paths);
        }
      }

      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (deleteError) throw new Error(deleteError.message);

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Could not delete product.");
      }
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error || "Product not found."}
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Back to products
          </button>
        </div>
      </div>
    );
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

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Product
              </h1>
              <p className="mt-2 text-gray-600">
                Update your product information.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || deleting}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete product"}
            </button>
          </div>
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
              disabled={saving || deleting}
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
              disabled={saving || deleting}
            >
              <option value="">Select a category</option>
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
                disabled={saving || deleting}
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
                disabled={saving || deleting}
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
                disabled={saving || deleting}
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
                  disabled={saving || deleting}
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
              disabled={saving || deleting}
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

            {(existingImages.length > 0 || imagePreviews.length > 0) && (
              <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {existingImages.map((url, i) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Image ${i + 1}`}
                      className="h-full w-full object-contain p-2"
                    />
                    {i === 0 && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-orange-500 px-2 py-0.5 text-[9px] font-black text-white">
                        Principale
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      aria-label="Supprimer l'image"
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-sm text-white opacity-0 transition group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}

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
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-orange-500 px-2 py-0.5 text-[9px] font-black text-white">
                      Nouveau
                    </span>
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
                disabled={saving || deleting}
                className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-gray-800"
              />
              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG ou WEBP — maximum 5 MB par image.
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
                disabled={saving || deleting}
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
                disabled={saving || deleting}
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
              disabled={saving || deleting}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || deleting}
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}