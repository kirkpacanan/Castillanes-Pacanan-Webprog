"use client";

import { useState } from "react";
import Link from "next/link";

const DISCOVER_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/", label: "Movie suggestion" },
];

const ABOUT_LINKS = [
  { href: "/contact", label: "Contact" },
  { href: "#", label: "Follow us" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" },
  { label: "YouTube", href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail("");
  };

  return (
    <footer
      className="flex flex-col items-center bg-slate-200 dark:bg-[#05050A]"
      style={{
        padding: "80px 64px 228px",
        gap: 80,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        className="flex w-full max-w-[1280px] flex-col gap-20"
        style={{ width: "min(100%, 1152px)" }}
      >
        {/* Content: row, gap 128px */}
        <div className="flex flex-col gap-16 md:flex-row md:gap-32">
          {/* Newsletter – 500px, gap 24px */}
          <div className="flex w-full max-w-[500px] flex-col gap-6">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Feelvie
            </Link>
            <p className="text-lg font-normal leading-[160%] text-slate-800 dark:text-white">
              Get Feelvie updates delivered to your inbox.
            </p>
            <div className="flex flex-col gap-3">
              <form
                onSubmit={handleSubscribe}
                className="flex flex-row gap-4"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="min-h-[45px] flex-1 rounded-xl border-0 bg-slate-300/80 px-3 py-2 text-lg text-slate-900 placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-slate-400 dark:bg-white/10 dark:text-white dark:placeholder:text-white/60 dark:focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="flex h-[49px] min-w-[135px] items-center justify-center rounded-full bg-slate-400 px-6 text-lg font-medium leading-[160%] text-slate-900 dark:bg-white/10 dark:text-white"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs font-normal leading-[160%] text-slate-700 dark:text-white">
                By subscribing you agree to our Privacy Policy and consent to
                receive updates from Feelvie.
              </p>
            </div>
          </div>

          {/* Links – row, gap 40px */}
          <div className="flex flex-1 flex-row flex-wrap gap-10 md:gap-12">
            {/* Discover */}
            <div className="flex flex-col gap-4">
              <p className="text-lg font-semibold leading-[160%] text-slate-900 dark:text-white">
                Discover
              </p>
              <div className="flex flex-col">
                {DISCOVER_LINKS.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="py-2 text-base font-normal leading-[160%] text-slate-800 hover:underline dark:text-white"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* About us */}
            <div className="flex flex-col gap-4">
              <p className="text-lg font-semibold leading-[160%] text-slate-900 dark:text-white">
                About us
              </p>
              <div className="flex flex-col">
                {ABOUT_LINKS.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="py-2 text-base font-normal leading-[160%] text-slate-800 hover:underline dark:text-white"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Instagram (social) */}
            <div className="flex flex-col gap-4">
              <p className="text-lg font-semibold leading-[160%] text-slate-900 dark:text-white">
                Instagram
              </p>
              <div className="flex flex-col gap-2">
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-2 text-base font-normal leading-[160%] text-slate-800 hover:underline dark:text-white"
                  >
                    <span className="inline-block h-6 w-6 shrink-0 rounded bg-slate-400 dark:bg-white/20" aria-hidden />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Credits – gap 32px, divider + row */}
        <div className="flex flex-col gap-8">
          <div
            className="w-full"
            className="border-t border-slate-300 dark:border-white/20"
          />
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-base font-normal leading-[160%] text-slate-800 dark:text-white">
              © 2025 Feelvie.
            </p>
            <div className="flex flex-row flex-wrap items-center justify-center gap-6 md:justify-end">
              <a
                href="#"
                className="text-base font-normal leading-[160%] text-slate-800 underline hover:no-underline dark:text-white"
              >
                Privacy policy
              </a>
              <a
                href="#"
                className="text-base font-normal leading-[160%] text-slate-800 underline hover:no-underline dark:text-white"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-base font-normal leading-[160%] text-slate-800 underline hover:no-underline dark:text-white"
              >
                Cookies Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
