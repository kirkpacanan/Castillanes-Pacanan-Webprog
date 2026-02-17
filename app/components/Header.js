"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import FeelvieLogo from "./FeelvieLogo";

const navLinkBase =
  "relative font-medium text-white hover:text-white/90 transition text-sm leading-snug py-2";
const morePaths = ["/how-it-works", "/about", "/contact"];
const morePathLabels = {
  "/how-it-works": "How it works",
  "/about": "About us",
  "/contact": "Contact",
};
function getMoreButtonLabel(pathname) {
  return morePathLabels[pathname] ?? "More";
}

function NavLink({ href, children, active }) {
  return (
    <Link href={href} className={`${navLinkBase} inline-block`}>
      {children}
      <span
        className={`absolute bottom-0 left-0 h-0.5 w-full bg-white origin-left transition-transform duration-200 ease-out ${
          active ? "scale-x-100" : "scale-x-0"
        }`}
        aria-hidden
      />
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { user, signOut, hydrated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = morePaths.some((p) => pathname === p);

  if (!hydrated) {
    return (
      <header className="sticky top-0 z-30 h-[100px] bg-[#05050A]">
        <div className="flex h-full w-full items-center justify-between px-6 md:px-12" style={{ maxWidth: 1403 }}>
          <div className="h-6 w-24 animate-pulse rounded bg-white/10" />
        </div>
      </header>
    );
  }

  return (
    <header
      className="sticky top-0 z-30 h-[100px] w-full bg-[#05050A]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="mx-auto flex h-full max-w-[1403px] items-center justify-between px-6 md:px-12">
        <nav className="flex items-center gap-5 md:gap-7">
          <FeelvieLogo className="h-9" />
          <NavLink href="/" active={pathname === "/"}>
            Home
          </NavLink>
          {user && (
            <>
              <NavLink href="/watch-list" active={pathname === "/watch-list"}>
                Watch list
              </NavLink>
              <NavLink href="/watched" active={pathname === "/watched"}>
                Watched
              </NavLink>
            </>
          )}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              className={`relative flex h-9 min-w-[7rem] items-center justify-center gap-1.5 rounded-full bg-[#05050A] px-4 text-sm font-medium text-white transition-colors hover:bg-white/10 ${isMoreActive ? "text-white" : ""}`}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              aria-label={`${getMoreButtonLabel(pathname)} menu`}
            >
              <span className="whitespace-nowrap">{getMoreButtonLabel(pathname)}</span>
              <svg
                className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-out ${moreOpen ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {isMoreActive && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-[calc(100%-1rem)] -translate-x-1/2 bg-white" aria-hidden />
              )}
            </button>
            {moreOpen && (
              <div
                className="fixed inset-0 z-10 bg-black/25 backdrop-blur-[2px]"
                aria-hidden
                onClick={() => setMoreOpen(false)}
              />
            )}
            <div
              className={`absolute left-0 top-full z-20 mt-2 min-w-[180px] origin-top-left rounded-xl border border-white/10 bg-[#05050A] py-1.5 shadow-xl transition-all duration-200 ease-out ${
                moreOpen
                  ? "translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-2 scale-95 opacity-0"
              }`}
            >
              <Link
                href="/how-it-works"
                className="block px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                onClick={() => setMoreOpen(false)}
              >
                How it works
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                onClick={() => setMoreOpen(false)}
              >
                About us
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                onClick={() => setMoreOpen(false)}
              >
                Contact
              </Link>
              <button
                type="button"
                onClick={() => { toggleTheme(); setMoreOpen(false); }}
                className="block w-full px-4 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </div>
          </div>
        </nav>

        <div>
          {user ? (
            <button
              type="button"
              onClick={signOut}
              className="flex h-8 min-w-[80px] items-center justify-center rounded-full bg-[#B22222] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#a01e1e]"
              style={{ borderBottom: "3px solid #8E1B1B" }}
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/signin"
              className="flex h-8 min-w-[80px] items-center justify-center rounded-full bg-[#B22222] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#a01e1e]"
              style={{ borderBottom: "3px solid #8E1B1B" }}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
