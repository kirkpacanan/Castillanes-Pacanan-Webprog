"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { user, signOut, hydrated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [moreOpen, setMoreOpen] = useState(false);

  if (!hydrated) {
    return (
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-[#0a0a0a]/90">
        <div className="mx-auto flex h-14 w-[min(1280px,94%)] items-center justify-between px-4">
          <div className="h-6 w-24 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
        </div>
      </header>
    );
  }

  const navGuest = (
    <>
      <Link
        href="/signin"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white"
      >
        Sign in
      </Link>
      <Link
        href="/"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white"
      >
        Home
      </Link>
    </>
  );

  const navUser = (
    <>
      <button
        type="button"
        onClick={signOut}
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white"
      >
        Log Out
      </button>
      <Link
        href="/"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white"
      >
        Home
      </Link>
      <Link
        href="/watch-list"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white"
      >
        Watch list
      </Link>
      <Link
        href="/watched"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white"
      >
        Watched
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-[#0a0a0a]/90">
      <div className="mx-auto flex h-14 w-[min(1280px,94%)] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className="text-lg tracking-tight">Feelvie</span>
        </Link>
        <nav className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          {user ? navUser : navGuest}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white"
            >
              More
            </button>
            {moreOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setMoreOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 min-w-[180px] rounded-xl border border-slate-200 bg-white py-2 shadow-lg dark:border-white/10 dark:bg-slate-900">
                  <Link
                    href="/how-it-works"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-white/90 dark:hover:bg-white/10"
                    onClick={() => setMoreOpen(false)}
                  >
                    How it works
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-white/90 dark:hover:bg-white/10"
                    onClick={() => setMoreOpen(false)}
                  >
                    About us
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-white/90 dark:hover:bg-white/10"
                    onClick={() => setMoreOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
