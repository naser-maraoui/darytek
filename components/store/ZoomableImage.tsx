"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  zoomScale?: number;
  sizes?: string;
};

function ZoomIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

export default function ZoomableImage({
  src,
  alt,
  zoomScale = 2.5,
  sizes = "(max-width: 768px) 100vw, 500px",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      onMouseEnter={() => setIsZooming(true)}
      onMouseLeave={() => {
        setIsZooming(false);
        setOrigin({ x: 50, y: 50 });
      }}
      onMouseMove={handleMouseMove}
      style={{ cursor: isZooming ? "zoom-out" : "zoom-in" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain p-4 transition-transform duration-200 ease-out"
        style={{
          transform: isZooming ? `scale(${zoomScale})` : "scale(1)",
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
      />

      {/* Zoom button (bottom-right) */}
      <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-black text-gray-700 shadow-sm">
        <ZoomIcon />
        Zoom
      </div>
    </div>
  );
}