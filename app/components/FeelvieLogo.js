"use client";

import Link from "next/link";

/**
 * Feelvie logo: film-strip icon + wordmark.
 * Use in Header, Footer, or standalone. Pass className for size; default height ~36px.
 */
export default function FeelvieLogo({ className = "h-9", href = "/", asLink = true }) {
  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Film frame + play icon (single SVG) */}
      <svg
        className="h-full w-auto shrink-0 aspect-square"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="36" height="36" rx="8" fill="#B22222" />
        <circle cx="6" cy="8" r="2" fill="white" fillOpacity="0.9" />
        <circle cx="6" cy="18" r="2" fill="white" fillOpacity="0.9" />
        <circle cx="6" cy="28" r="2" fill="white" fillOpacity="0.9" />
        <circle cx="30" cy="8" r="2" fill="white" fillOpacity="0.9" />
        <circle cx="30" cy="18" r="2" fill="white" fillOpacity="0.9" />
        <circle cx="30" cy="28" r="2" fill="white" fillOpacity="0.9" />
        <path d="M15 11v14l10-7-10-7z" fill="white" />
      </svg>
      <span className="font-bold tracking-tight text-white" style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
        Feelvie
      </span>
    </span>
  );

  if (asLink && href) {
    return (
      <Link href={href} className="inline-flex items-center transition opacity-90 hover:opacity-100">
        {content}
      </Link>
    );
  }
  return content;
}
