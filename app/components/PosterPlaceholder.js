"use client";

/**
 * Inline poster placeholder – film strip + clapperboard style.
 * Fills its container; use className for size (e.g. h-full w-full).
 */
export default function PosterPlaceholder({ className = "", ariaHidden }) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a0a0a] via-[#2d1515] to-[#0d0505] ${className}`}
      role={ariaHidden ? undefined : "img"}
      aria-hidden={ariaHidden}
      aria-label={ariaHidden ? undefined : "Poster placeholder"}
    >
      <svg
        viewBox="0 0 140 200"
        className="h-full w-full object-contain"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Film strip holes */}
        <circle cx="22" cy="28" r="5" fill="rgba(255,255,255,0.06)" />
        <circle cx="22" cy="100" r="5" fill="rgba(255,255,255,0.06)" />
        <circle cx="22" cy="172" r="5" fill="rgba(255,255,255,0.06)" />
        <circle cx="118" cy="28" r="5" fill="rgba(255,255,255,0.06)" />
        <circle cx="118" cy="100" r="5" fill="rgba(255,255,255,0.06)" />
        <circle cx="118" cy="172" r="5" fill="rgba(255,255,255,0.06)" />
        {/* Frame */}
        <rect x="38" y="44" width="64" height="112" rx="4" fill="rgba(30,30,30,0.9)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" />
        {/* Clapperboard / screen */}
        <path d="M44 50 L96 50 L96 110 L44 110 Z" fill="rgba(142,27,27,0.2)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <path d="M44 50 L48 54 L48 106 L44 110 Z" fill="rgba(142,27,27,0.3)" />
        {/* Play icon */}
        <path d="M62 72 L62 98 L82 85 Z" fill="rgba(255,255,255,0.25)" />
        <circle cx="72" cy="85" r="16" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
