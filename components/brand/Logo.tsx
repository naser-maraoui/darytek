import Link from "next/link";
import Image from "next/image";

type Props = {
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "dark" | "light";
  className?: string;
  showText?: boolean;
};

// Logo container sizes (width × height keeps the aspect ratio ~1.8:1)
const sizes = {
  sm: { w: 120, h: 40, pad: "p-1" },
  md: { w: 156, h: 52, pad: "p-1" },
  lg: { w: 192, h: 64, pad: "p-1.5" },
  xl: { w: 240, h: 80, pad: "p-2" },
};

export default function Logo({
  href = "/",
  size = "md",
  variant = "dark",
  className = "",
  showText = false,
}: Props) {
  const s = sizes[size];

  return (
    <Link
      href={href}
      className={`group flex flex-shrink-0 items-center gap-2.5 ${className}`}
      aria-label="Darytek"
    >
      {/* On dark backgrounds, wrap the logo in a white rounded container */}
      {variant === "light" ? (
        <span
          className={`flex items-center justify-center rounded-xl bg-white shadow-sm ${s.pad}`}
          style={{ width: s.w, height: s.h }}
        >
          <span className="relative h-full w-full">
            <Image
              src="/logo.jpg"
              alt="Darytek"
              fill
              sizes={`${s.w}px`}
              className="object-contain"
              priority
            />
          </span>
        </span>
      ) : (
        <span
          className="relative flex-shrink-0"
          style={{ width: s.w, height: s.h }}
        >
          <Image
            src="/logo.jpg"
            alt="Darytek"
            fill
            sizes={`${s.w}px`}
            className="object-contain"
            priority
          />
        </span>
      )}

      {/* Optional text fallback (kept off by default since the logo already has text) */}
      {showText && (
        <span className="text-xl font-black tracking-tight">
          <span
            className={variant === "light" ? "text-white" : "text-navy-800"}
          >
            Dary
          </span>
          <span className="text-orange-500">tek</span>
        </span>
      )}
    </Link>
  );
}