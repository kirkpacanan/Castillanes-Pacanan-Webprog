"use client";

import { useState } from "react";
import Link from "next/link";
import CookiesModal from "./CookiesModal";
import PrivacyModal from "./PrivacyModal";
import TermsModal from "./TermsModal";

const DISCOVER_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/", label: "Movie suggestion" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "X", href: "#", icon: "x" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "YouTube", href: "#", icon: "youtube" },
];

function SocialIcon({ name, className = "h-4 w-4" }) {
  const c = className;
  if (name === "facebook")
    return (
      <svg className={c} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  if (name === "instagram")
    return (
      <svg className={c} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  if (name === "x")
    return (
      <svg className={c} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  if (name === "linkedin")
    return (
      <svg className={c} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  if (name === "youtube")
    return (
      <svg className={c} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  return null;
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showCookies, setShowCookies] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail("");
  };

  return (
    <footer
      className="flex w-full flex-col items-center border-t border-white/5 bg-[#05050A] px-4 sm:px-6 py-12 sm:py-20 md:px-16"
      style={{ fontFamily: "'Space Grotesk', sans-serif", gap: 60 }}
    >
      <div className="flex w-full max-w-[1152px] flex-col gap-12 sm:gap-20">
        {/* Content: row, gap 128px */}
        <div className="flex flex-col gap-8 sm:gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-32">
          {/* Newsletter – width 500px, gap 24px */}
          <div className="flex w-full lg:max-w-[500px] flex-col gap-4 sm:gap-6">
            <img 
              src="/feelvie-full-logo.png" 
              alt="Feelvie" 
              className="h-12 w-auto flex-shrink-0 max-w-fit transition-all duration-300 ease-out hover:scale-105 hover:drop-shadow-[0_0_12px_rgba(178,34,34,0.4)] cursor-pointer" 
            />
            <p
              className="text-white/85"
              style={{ fontSize: 14, fontWeight: 400, lineHeight: "170%" }}
            >
              Get Feelvie updates delivered to your inbox.
            </p>
            <div className="flex flex-col gap-3">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="min-h-[40px] w-full sm:flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none transition-all duration-300 ease-out hover:border-white/20 hover:bg-white/8 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/30 focus:bg-white/10"
                  style={{ fontSize: 14, lineHeight: "160%" }}
                />
                <button
                  type="submit"
                  className="feelvie-button flex h-[40px] w-full sm:w-auto sm:min-w-[120px] shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(178,34,34,0.5)] active:scale-95"
                  style={{ lineHeight: "160%" }}
                >
                  Subscribe
                </button>
              </form>
              <p
                className="text-white/70"
                style={{ fontSize: 11, fontWeight: 400, lineHeight: "170%" }}
              >
                By subscribing you agree to our{" "}
                <button
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="underline text-red-400 transition-all duration-300 ease-out hover:text-red-300 hover:scale-105 inline-block"
                >
                  Privacy Policy
                </button>{" "}
                and consent to receive updates from Feelvie.
              </p>
            </div>
          </div>

          {/* Links – row, gap 40px */}
          <div className="flex flex-1 flex-row flex-wrap gap-10 lg:ml-auto lg:justify-end">
            {/* Discover – 148px, gap 16px */}
            <div className="flex w-[148px] flex-col gap-4">
              <p
                className="font-semibold text-white"
                style={{ fontSize: 14, fontWeight: 600, lineHeight: "160%" }}
              >
                Discover
              </p>
              <div className="flex flex-col">
                {DISCOVER_LINKS.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="group relative block py-1.5 text-white/85 transition-all duration-300 ease-out hover:text-white hover:translate-x-2"
                    style={{ fontSize: 13, fontWeight: 400, lineHeight: "160%" }}
                  >
                    <span className="relative inline-block">
                      <span className="absolute -left-3 top-1/2 -translate-y-1/2 text-red-400 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:-left-4">→</span>
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Socials – 148px, gap 16px */}
            <div className="flex w-[148px] flex-col gap-4">
              <p
                className="font-semibold text-white"
                style={{ fontSize: 14, fontWeight: 600, lineHeight: "160%" }}
              >
                Socials
              </p>
              <div className="flex flex-col">
                {SOCIAL_LINKS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 py-1.5 text-white/85 transition-all duration-300 ease-out hover:text-white hover:translate-x-2"
                    style={{ fontSize: 13, fontWeight: 400, lineHeight: "160%" }}
                  >
                    <SocialIcon name={icon} className="h-4 w-4 shrink-0 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:text-red-400" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Credits – gap 32px, divider + row */}
        <div className="flex flex-col gap-6 sm:gap-8">
          <div
            className="w-full border-t border-white/20"
            style={{ height: 0 }}
            aria-hidden
          />
          <div className="flex flex-col sm:flex-row justify-center">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 px-4 sm:px-0" style={{ maxWidth: 360 }}>
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="group relative text-white/80 transition-all duration-300 ease-out hover:text-white text-sm sm:text-xs"
                style={{ fontSize: 13, fontWeight: 400, lineHeight: "160%" }}
              >
                Terms of Service
                <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-red-400 to-red-300 transition-all duration-300 ease-out group-hover:w-full" />
              </button>
              <button
                type="button"
                onClick={() => setShowPrivacy(true)}
                className="group relative text-white/80 transition-all duration-300 ease-out hover:text-white text-sm sm:text-xs"
                style={{ fontSize: 13, fontWeight: 400, lineHeight: "160%" }}
              >
                Privacy Policy
                <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-red-400 to-red-300 transition-all duration-300 ease-out group-hover:w-full" />
              </button>
              <button
                type="button"
                onClick={() => setShowCookies(true)}
                className="group relative text-white/80 transition-all duration-300 ease-out hover:text-white text-sm sm:text-xs"
                style={{ fontSize: 13, fontWeight: 400, lineHeight: "160%" }}
              >
                Cookies Settings
                <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-red-400 to-red-300 transition-all duration-300 ease-out group-hover:w-full" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <CookiesModal open={showCookies} onClose={() => setShowCookies(false)} />
    </footer>
  );
}
