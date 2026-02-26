"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMoodGlow } from "../context/MoodGlowContext";

const navLinkBase =
  "relative font-medium text-white/90 hover:text-white transition-all duration-300 ease-out text-sm leading-snug py-2";
const morePaths = ["/how-it-works", "/about", "/contact"];
const morePathLabels = {
  "/how-it-works": "How it works",
  "/about": "About us",
  "/contact": "Contact",
};
function getMoreButtonLabel(pathname) {
  return morePathLabels[pathname] ?? "More";
}

/** Convert RGB [0-255, 0-255, 0-255] to hue in degrees 0-360 for hue-rotate filter */
function rgbToHue(r, g, b) {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B);
  const delta = max - min;
  if (delta === 0) return 0;
  let h = 0;
  if (max === R) h = ((G - B) / delta) % 6;
  else if (max === G) h = (B - R) / delta + 2;
  else h = (R - G) / delta + 4;
  h = (h * 60 + 360) % 360;
  return Math.round(h);
}

/** Generate CSS filter for logo based on mood color */
function getLogoFilter(moodR, moodG, moodB, moodRgb, isHover = false) {
  const hue = rgbToHue(moodR, moodG, moodB);
  
  // Calculate saturation/brightness of the color
  const max = Math.max(moodR, moodG, moodB) / 255;
  const min = Math.min(moodR, moodG, moodB) / 255;
  const saturation = max === 0 ? 0 : (max - min) / max;
  const brightness = max;
  
  // For very desaturated colors (black, white, gray), use a different approach
  if (saturation < 0.3) {
    // White/light colors - make logo white
    if (brightness > 0.6) {
      return isHover
        ? `grayscale(1) brightness(2.5) contrast(1.1) drop-shadow(0 0 12px rgba(${moodRgb}, 0.9)) drop-shadow(0 0 24px rgba(${moodRgb}, 0.6))`
        : `grayscale(1) brightness(2.2) contrast(1.05) drop-shadow(0 0 8px rgba(${moodRgb}, 0.7))`;
    }
    // Black/dark colors - make logo black/very dark
    return isHover
      ? `grayscale(1) brightness(0.3) contrast(1.5) drop-shadow(0 0 12px rgba(${moodRgb}, 0.8))`
      : `grayscale(1) brightness(0.4) contrast(1.3) drop-shadow(0 0 6px rgba(${moodRgb}, 0.6))`;
  }
  
  // Special handling for Yellow (hue 40-60) - make it VERY yellow like purple is VERY purple
  if (hue >= 40 && hue <= 60) {
    return isHover
      ? `hue-rotate(${hue + 5}deg) saturate(2.5) brightness(1.35) contrast(1.15) drop-shadow(0 0 12px rgba(${moodRgb}, 0.85))`
      : `hue-rotate(${hue + 5}deg) saturate(2.2) brightness(1.3) contrast(1.1) drop-shadow(0 0 8px rgba(${moodRgb}, 0.7))`;
  }
  
  // Special handling for Orange (hue 15-39) - make it VERY orange like purple is VERY purple
  if (hue >= 15 && hue <= 39) {
    return isHover
      ? `hue-rotate(${hue + 3}deg) saturate(2.3) brightness(1.25) contrast(1.12) drop-shadow(0 0 12px rgba(${moodRgb}, 0.85))`
      : `hue-rotate(${hue + 3}deg) saturate(2.0) brightness(1.2) contrast(1.08) drop-shadow(0 0 8px rgba(${moodRgb}, 0.7))`;
  }
  
  // For other saturated colors, use hue-rotate
  return isHover
    ? `hue-rotate(${hue}deg) saturate(1.3) brightness(1.1) drop-shadow(0 0 12px rgba(${moodRgb}, 0.7))`
    : `hue-rotate(${hue}deg) saturate(1.2) brightness(1.05) drop-shadow(0 0 8px rgba(${moodRgb}, 0.5))`;
}

function NavLink({ href, children, active, moodRgb }) {
  const moodStyle = {
    background: `linear-gradient(to right, rgb(${moodRgb}), rgba(${moodRgb}, 0.85))`,
    boxShadow: `0 0 8px rgba(${moodRgb}, 0.6)`,
  };
  return (
    <Link href={href} className={`${navLinkBase} group inline-block`}>
      <span className="relative inline-block transition-transform duration-300 ease-out group-hover:scale-105">
        {children}
      </span>
      <span
        className={`absolute bottom-0 left-0 h-0.5 w-full origin-left transition-all duration-300 ease-out ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
        style={moodStyle}
        aria-hidden
      />
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, hydrated } = useAuth();
  const { moodGlowColor } = useMoodGlow();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isSignInPage = pathname === "/signin";
  const moodRgb = `${moodGlowColor[0]}, ${moodGlowColor[1]}, ${moodGlowColor[2]}`;

  const isMoreActive = morePaths.some((p) => pathname === p);

  if (!hydrated) {
    return (
      <header className="sticky top-0 z-30 h-[70px] sm:h-[100px] bg-[#05050A]">
        <div className="flex h-full w-full items-center justify-between px-4 sm:px-6 md:px-12" style={{ maxWidth: 1403 }}>
          <div className="h-6 w-24 animate-pulse rounded bg-white/10" />
        </div>
      </header>
    );
  }

  return (
    <header
      className="header-mood sticky top-0 z-30 h-[70px] sm:h-[100px] w-full bg-[#05050A] border-b border-white/5"
      style={{
        fontFamily: "'Inter', sans-serif",
        ["--mood-r"]: moodGlowColor[0],
        ["--mood-g"]: moodGlowColor[1],
        ["--mood-b"]: moodGlowColor[2],
      }}
    >
      <div className="mx-auto flex h-full max-w-[1403px] items-center justify-between px-4 sm:px-6 md:px-12">
        {/* Logo */}
        <Link href="/" className="header-logo-link group inline-flex items-center transition-all duration-300 ease-out opacity-90 hover:opacity-100 hover:scale-105 z-50">
          <img
            src="/feelvie-logo.png"
            alt="Feelvie"
            className="header-logo-img h-14 sm:h-20 w-auto"
            style={{
              filter: getLogoFilter(moodGlowColor[0], moodGlowColor[1], moodGlowColor[2], moodRgb, false),
              transition: 'filter 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transition = 'filter 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
              e.currentTarget.style.filter = getLogoFilter(moodGlowColor[0], moodGlowColor[1], moodGlowColor[2], moodRgb, true);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transition = 'filter 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
              e.currentTarget.style.filter = getLogoFilter(moodGlowColor[0], moodGlowColor[1], moodGlowColor[2], moodRgb, false);
              // Restore the longer transition for mood changes after a delay
              setTimeout(() => {
                if (e.currentTarget) {
                  e.currentTarget.style.transition = 'filter 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                }
              }, 500);
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <NavLink href="/" active={pathname === "/"} moodRgb={moodRgb}>
            Home
          </NavLink>
          {user && (
            <>
              <NavLink href="/watch-list" active={pathname === "/watch-list"} moodRgb={moodRgb}>
                Watch list
              </NavLink>
              <NavLink href="/watched" active={pathname === "/watched"} moodRgb={moodRgb}>
                Watched
              </NavLink>
            </>
          )}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              className={`${navLinkBase} group inline-flex items-center gap-1.5`}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              aria-label={`${getMoreButtonLabel(pathname)} menu`}
            >
              <span className="whitespace-nowrap transition-transform duration-300 ease-out group-hover:scale-105">{getMoreButtonLabel(pathname)}</span>
              <svg
                className={`h-4 w-4 shrink-0 transition-all duration-300 ease-out ${moreOpen ? "rotate-180 scale-110" : "rotate-0 group-hover:scale-110"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-full origin-left transition-all duration-300 ease-out ${isMoreActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                style={{ background: `linear-gradient(to right, rgb(${moodRgb}), rgba(${moodRgb}, 0.85))`, boxShadow: `0 0 8px rgba(${moodRgb}, 0.6)` }}
                aria-hidden
              />
            </button>
            {moreOpen && (
              <div
                className="fixed inset-0 z-10 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300"
                aria-hidden
                onClick={() => setMoreOpen(false)}
              />
            )}
            <div
              className={`absolute left-0 top-full z-20 mt-2 min-w-[180px] origin-top-left overflow-hidden rounded-xl border border-white/10 bg-[#05050A] py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out ${
                moreOpen
                  ? "translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-4 scale-95 opacity-0"
              }`}
            >
              <Link
                href="/how-it-works"
                className="group relative block px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent hover:text-white hover:pl-5"
                onClick={() => setMoreOpen(false)}
              >
                <span className="relative z-10">How it works</span>
                <span className="absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r opacity-0 transition-all duration-300 group-hover:h-8 group-hover:opacity-100" style={{ background: `linear-gradient(to bottom, rgb(${moodRgb}), rgba(${moodRgb}, 0.85))` }} />
              </Link>
              <Link
                href="/about"
                className="group relative block px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent hover:text-white hover:pl-5"
                onClick={() => setMoreOpen(false)}
              >
                <span className="relative z-10">About us</span>
                <span className="absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r opacity-0 transition-all duration-300 group-hover:h-8 group-hover:opacity-100" style={{ background: `linear-gradient(to bottom, rgb(${moodRgb}), rgba(${moodRgb}, 0.85))` }} />
              </Link>
              <Link
                href="/contact"
                className="group relative block px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent hover:text-white hover:pl-5"
                onClick={() => setMoreOpen(false)}
              >
                <span className="relative z-10">Contact</span>
                <span className="absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r opacity-0 transition-all duration-300 group-hover:h-8 group-hover:opacity-100" style={{ background: `linear-gradient(to bottom, rgb(${moodRgb}), rgba(${moodRgb}, 0.85))` }} />
              </Link>

            </div>
          </div>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:block">
          {user ? (
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.push("/signin");
              }}
              className="flex h-9 min-w-[80px] items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition-all duration-300 ease-out hover:scale-105 active:scale-95"
              style={{
                background: `rgb(${moodRgb})`,
                borderBottom: `4px solid rgba(${moodRgb}, 0.6)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 20px rgba(${moodRgb}, 0.5)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "";
              }}
            >
              Sign out
            </button>
          ) : (
            <Link
              href={isSignInPage ? "/signup" : "/signin"}
              className="flex h-9 min-w-[80px] items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition-all duration-300 ease-out hover:scale-105 active:scale-95"
              style={{
                background: `rgb(${moodRgb})`,
                borderBottom: `4px solid rgba(${moodRgb}, 0.6)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 20px rgba(${moodRgb}, 0.5)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "";
              }}
            >
              {isSignInPage ? "Sign up" : "Sign in"}
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden z-50 p-2 text-white/90 hover:text-white transition-colors"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`fixed top-[70px] right-0 bottom-0 z-40 w-64 bg-[#05050A] border-l border-white/10 transform transition-transform duration-300 ease-out lg:hidden ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <nav className="flex flex-col p-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all ${
                pathname === "/" ? "bg-white/10 text-white" : ""
              }`}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/watch-list"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all ${
                    pathname === "/watch-list" ? "bg-white/10 text-white" : ""
                  }`}
                >
                  Watch list
                </Link>
                <Link
                  href="/watched"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all ${
                    pathname === "/watched" ? "bg-white/10 text-white" : ""
                  }`}
                >
                  Watched
                </Link>
              </>
            )}
            <div className="border-t border-white/10 my-2 pt-2">
              <Link
                href="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all block ${
                  pathname === "/how-it-works" ? "bg-white/10 text-white" : ""
                }`}
              >
                How it works
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all block ${
                  pathname === "/about" ? "bg-white/10 text-white" : ""
                }`}
              >
                About us
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all block ${
                  pathname === "/contact" ? "bg-white/10 text-white" : ""
                }`}
              >
                Contact
              </Link>
            </div>
            <div className="border-t border-white/10 pt-2">
              {user ? (
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    setMobileMenuOpen(false);
                    router.push("/signin");
                  }}
                  className="w-full flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white"
                  style={{ background: `rgb(${moodRgb})`, borderBottom: `4px solid rgba(${moodRgb}, 0.6)` }}
                >
                  Sign out
                </button>
              ) : (
                <Link
                  href={isSignInPage ? "/signup" : "/signin"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white"
                  style={{ background: `rgb(${moodRgb})`, borderBottom: `4px solid rgba(${moodRgb}, 0.6)` }}
                >
                  {isSignInPage ? "Sign up" : "Sign in"}
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
