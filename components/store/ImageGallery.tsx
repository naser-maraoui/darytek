"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import ZoomableImage from "./ZoomableImage";

type Props = {
  images: string[];
  alt: string;
  badge?: React.ReactNode;
};

// ---------- Icons ----------
function ChevronUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function ImageGallery({ images, alt, badge }: Props) {
  const [active, setActive] = useState(0);
  const [prevImagesKey, setPrevImagesKey] = useState("");
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Reset to first image when the images list changes (during render)
  const imagesKey = images.join("|");
  if (imagesKey !== prevImagesKey) {
    setPrevImagesKey(imagesKey);
    setActive(0);
  }

  const safeImages = images.length > 0 ? images : [];
  const activeSrc = safeImages[active] ?? "";

  if (safeImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-gray-300">
        Aucune image
      </div>
    );
  }

  const goPrev = () => {
    setActive((i) => (i - 1 + safeImages.length) % safeImages.length);
  };
  const goNext = () => {
    setActive((i) => (i + 1) % safeImages.length);
  };

  const scrollThumbs = (direction: "up" | "down") => {
    const el = thumbnailsRef.current;
    if (!el) return;
    el.scrollBy({ top: direction === "up" ? -170 : 170, behavior: "smooth" });
  };

  const hasManyThumbs = safeImages.length > 4;
  const hasMultiple = safeImages.length > 1;

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* ---------- VERTICAL THUMBNAILS ---------- */}
      {hasMultiple && (
        <div className="flex flex-col items-center gap-2">
          {/* Up arrow */}
          {hasManyThumbs && (
            <button
              type="button"
              onClick={() => scrollThumbs("up")}
              aria-label="Images précédentes"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-blue-500 hover:text-orange-600"
            >
              <ChevronUpIcon />
            </button>
          )}

          {/* Thumbnails strip */}
          <div
            ref={thumbnailsRef}
            className="flex max-h-[360px] flex-col gap-2 overflow-y-auto scroll-smooth sm:max-h-[440px] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {safeImages.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Image ${i + 1}`}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white transition sm:h-20 sm:w-20 ${
                  i === active
                    ? "border-blue-600 shadow-md ring-2 ring-blue-100"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={src}
                  alt={`${alt} - vue ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                />
              </button>
            ))}
          </div>

          {/* Down arrow */}
          {hasManyThumbs && (
            <button
              type="button"
              onClick={() => scrollThumbs("down")}
              aria-label="Images suivantes"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-blue-500 hover:text-orange-600"
            >
              <ChevronDownIcon />
            </button>
          )}
        </div>
      )}

      {/* ---------- MAIN IMAGE ---------- */}
      <div className="relative min-w-0 flex-1">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-b from-gray-50 to-white">
          <ZoomableImage
            src={activeSrc}
            alt={alt}
            sizes="(max-width: 768px) 100vw, 600px"
          />

          {/* Prev / Next arrows */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Image précédente"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white/95 text-gray-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white hover:text-orange-600 sm:h-11 sm:w-11"
              >
                <ChevronLeftIcon />
              </button>

              <button
                type="button"
                onClick={goNext}
                aria-label="Image suivante"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white/95 text-gray-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white hover:text-orange-600 sm:h-11 sm:w-11"
              >
                <ChevronRightIcon />
              </button>
            </>
          )}

          {/* Image counter */}
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-black text-white backdrop-blur">
            {active + 1} / {safeImages.length}
          </div>

          {/* Badge (promo / stock) */}
          {badge}
        </div>
      </div>
    </div>
  );
}