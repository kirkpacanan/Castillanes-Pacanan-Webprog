"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

const STEPS = [
  {
    title: "Type what you're feeling",
    body: "Write a sentence or phrase that captures your mood, no matter how specific or abstract.",
    icon: "mood"
  },
  {
    title: "Our AI reads between the lines",
    body: "We analyze the words, the tone, and the emotional weight of what you've shared to find the right match.",
    icon: "analytics"
  },
  {
    title: "Get films that resonate",
    body: "Instantly receive movies matched to your emotional state, not just your genre preference.",
    icon: "movie"
  }
];

const LIST_ITEMS = [
  { icon: "search", title: "Search", body: "Type how you feel in plain language. No genres, no filters—just your mood." },
  { icon: "explore", title: "Explore", body: "Browse recommendations tailored to the emotional vibe you described." },
  { icon: "search", title: "Refine", body: "Not quite right? Try different words. Each phrase surfaces new matches." },
  { icon: "browse", title: "Browse", body: "Discover films by feeling. Save to your list or mark as watched when you're signed in." }
];

const HIGHLIGHTS = [
  { title: "Zero friction", body: "Share a mood in a sentence and get a match instantly." },
  { title: "Emotion mapping", body: "We read tone, intensity, and context to guide each result." },
  { title: "Full control", body: "Refine with a new phrase to shift the vibe and explore." }
];

const FAQ = [
  { q: "Do I need an account?", a: "No. Feelvie is free and requires no sign-up to discover films. Simply type how you're feeling and let our AI do the work. Accounts are optional for saving watch lists and reviews." },
  { q: "How accurate are recommendations?", a: "Our AI analyzes the emotional weight and tone of your words, then matches those emotions to films that resonate. The more specific you are, the better the results." },
  { q: "Can I suggest movies or moods?", a: "Yes. With an account you can submit movie suggestions and propose new mood categories to help improve Feelvie for everyone." },
  { q: "What if I don't find what I want?", a: "Try rephrasing how you feel. Different words capture different nuances. Search again with a new phrase to surface different films." },
  { q: "Is my data private?", a: "Searches are processed to find films; we don't store personal data without an account. If you create one, your information stays secure and is never shared with third parties." }
];

function Icon({ name, className = "h-12 w-12" }) {
  const c = "text-white";
  if (name === "mood")
    return (
      <svg className={`${className} ${c}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
      </svg>
    );
  if (name === "analytics")
    return (
      <svg className={`${className} ${c}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
      </svg>
    );
  if (name === "movie")
    return (
      <svg className={`${className} ${c}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
      </svg>
    );
  if (name === "search")
    return (
      <svg className={`${className} ${c}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      </svg>
    );
  if (name === "explore")
    return (
      <svg className={`${className} ${c}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    );
  if (name === "browse")
    return (
      <svg className={`${className} ${c}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
      </svg>
    );
  return null;
}

export default function HowItWorksPage() {
  const [inView, setInView] = useState(new Set());
  const headerRef = useRef(null);
  const pathRef = useRef(null);
  const overlayRef = useRef(null);
  const listRef = useRef(null);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const refs = [
      { ref: headerRef, id: "header" },
      { ref: pathRef, id: "path" },
      { ref: overlayRef, id: "overlay" },
      { ref: listRef, id: "list" },
      { ref: faqRef, id: "faq" },
      { ref: ctaRef, id: "cta" }
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = refs.find((r) => r.ref.current === entry.target)?.id;
          if (!id) return;
          setInView((prev) => {
            const next = new Set(prev);
            if (entry.isIntersecting) next.add(id);
            else next.delete(id);
            return next;
          });
        });
      },
      { rootMargin: "-8% 0px -8% 0px", threshold: 0 }
    );
    const nodes = refs.map((r) => r.ref.current).filter(Boolean);
    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="feelvie-page relative flex flex-col items-stretch overflow-hidden">
      <div className="feelvie-ambient" aria-hidden>
        <div className="feelvie-ambient-spot feelvie-ambient-spot-1" />
        <div className="feelvie-ambient-spot feelvie-ambient-spot-2" />
        <div className="feelvie-grid" />
      </div>

      {/* Header */}
      <header
        ref={headerRef}
        className={`hiw-header-bg relative z-10 flex flex-col items-center gap-16 px-8 py-28 text-center md:px-16 ${inView.has("header") ? "hiw-animate hiw-in-view hiw-fade-up" : "hiw-animate hiw-fade-up"}`}
      >
        <div className="flex max-w-[860px] flex-col items-center gap-6">
          <p className="feelvie-kicker">Process</p>
          <h1 className="feelvie-title text-5xl font-semibold leading-[110%] text-white md:text-7xl">
            How it works
          </h1>
          <p className="max-w-[760px] text-lg leading-[170%] text-white/85 md:text-xl">
            Feelvie strips away the noise of traditional categories. Tell us what you feel, and we match you with films that resonate.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="feelvie-chip px-4 py-1.5 text-xs font-semibold">Mood-first AI</span>
            <span className="feelvie-chip px-4 py-1.5 text-xs font-semibold">No filters required</span>
            <span className="feelvie-chip px-4 py-1.5 text-xs font-semibold">Instant results</span>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <Link
            href="/"
            className="feelvie-button flex items-center justify-center rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-base sm:text-lg font-medium text-white w-full sm:w-auto transition-all duration-300 ease-out hover:scale-105 active:scale-95"
          >
            Home
          </Link>
          <Link
            href="/"
            className="feelvie-button-ghost flex items-center justify-center rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-base sm:text-lg font-medium text-white w-full sm:w-auto transition-all duration-300 ease-out hover:scale-105"
          >
            Movie suggestion
          </Link>
        </div>
      </header>

      {/* Layout 237 — bg #05050A, 3 columns */}
      <section
        ref={pathRef}
        className={`hiw-section relative z-10 flex flex-col items-center gap-12 sm:gap-16 px-4 sm:px-8 py-16 sm:py-28 md:px-16 ${inView.has("path") ? "hiw-in-view" : ""}`}
        style={{ background: "#05050A" }}
      >
        <div className="hiw-step hiw-delay-0 flex max-w-[768px] flex-col items-center gap-4 sm:gap-6 text-center px-4">
          <h2 className="feelvie-title text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-semibold leading-[120%] text-white">
            The path from feeling to film
          </h2>
          <p className="max-w-[768px] text-base sm:text-lg md:text-xl leading-[170%] text-white/85">
            No jargon, no complexity. Just you, your emotions, and the movies that understand them.
          </p>
        </div>
        <div className="grid w-full max-w-[1152px] grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className={`hiw-step ${["hiw-delay-1", "hiw-delay-2", "hiw-delay-3"][i]} feelvie-card flex flex-col gap-4 sm:gap-6 p-6 sm:p-8 text-left transition-all duration-300 ease-out hover:scale-[1.02] group`}>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Icon name={step.icon} className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <span className="feelvie-chip px-3 py-1 text-xs font-semibold">0{i + 1}</span>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-[120%] text-white">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg leading-[170%] text-white/80">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid w-full max-w-[980px] grid-cols-1 gap-4 sm:grid-cols-3">
          {HIGHLIGHTS.map((item, i) => (
            <div key={item.title} className={`hiw-step ${["hiw-delay-2", "hiw-delay-3", "hiw-delay-4"][i]} feelvie-card-muted flex flex-col gap-3 p-5 text-left transition-all duration-300 ease-out hover:scale-[1.02]`}>
              <p className="text-base font-semibold text-white">{item.title}</p>
              <p className="text-sm leading-[170%] text-white/70">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-4">
          <Link
            href="/"
            className="feelvie-button-ghost rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-base sm:text-lg font-medium text-white w-full sm:w-auto text-center transition-all duration-300 ease-out hover:scale-105"
          >
            Learn more
          </Link>
          <Link
            href="/about"
            className="feelvie-link-mood flex items-center justify-center gap-2 rounded-full text-base sm:text-lg font-medium text-white w-full sm:w-auto transition-all duration-300 ease-out hover:scale-105"
          >
            More
            <svg className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 ease-out group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
          </Link>
        </div>
      </section>

      {/* Layout 442 — dark overlay section (two columns) */}
      <section
        ref={overlayRef}
        className={`hiw-overlay-bg hiw-section relative z-10 flex flex-col items-center gap-12 sm:gap-20 px-4 sm:px-8 py-16 sm:py-28 md:px-16 ${inView.has("overlay") ? "hiw-in-view" : ""}`}
      >
        <div className="grid w-full max-w-[1152px] grid-cols-1 gap-12 sm:gap-20 lg:grid-cols-2">
          <div className="hiw-overlay-left flex flex-col gap-3 sm:gap-4">
            <p className="feelvie-kicker">Intelligence</p>
            <h2 className="feelvie-title text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-semibold leading-[120%] text-white">
              Technology that understands emotion
            </h2>
          </div>
          <div className="hiw-overlay-right flex flex-col justify-end gap-6 sm:gap-8">
            <p className="max-w-[536px] text-base sm:text-lg md:text-xl leading-[170%] text-white/85">
              Behind every recommendation is sentiment analysis, emotional mapping, and a curated database of films. Feelvie doesn&apos;t just predict what you want—it understands what you need.
            </p>
            <div className="feelvie-card-muted flex flex-col gap-4 p-6 transition-all duration-300 ease-out hover:scale-[1.02]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Signal stack</p>
              <div className="flex flex-col gap-3 text-sm text-white/80">
                <span>Language sentiment</span>
                <span>Emotional intensity</span>
                <span>Theme alignment</span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-6">
              <Link href="/" className="feelvie-button-ghost rounded-full px-6 py-2.5 text-lg font-medium text-white transition-all duration-300 ease-out hover:scale-105">
                Discover
              </Link>
              <Link href="/about" className="feelvie-link-mood flex items-center gap-2 text-lg font-medium text-white transition-all duration-300 ease-out hover:scale-105">
                More
                <svg className="h-6 w-6 transition-transform duration-300 ease-out group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Layout 31 — bg #350A0A, list + placeholder image */}
      <section
        ref={listRef}
        className={`hiw-list-bg hiw-section relative z-10 flex flex-col items-center gap-20 px-8 py-28 md:px-16 ${inView.has("list") ? "hiw-in-view" : ""}`}
      >
        <div className="grid w-full max-w-[1152px] grid-cols-1 gap-20 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {LIST_ITEMS.map((item, i) => (
                <div key={item.title} className={`hiw-list-card ${["hiw-delay-0", "hiw-delay-1", "hiw-delay-2", "hiw-delay-3"][i]} feelvie-card flex flex-col gap-4 p-6 transition-all duration-300 ease-out hover:scale-[1.02]`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Icon name={item.icon} className="h-9 w-9" />
                  </div>
                  <h4 className="text-xl font-semibold leading-[120%] text-white md:text-2xl">
                    {item.title}
                  </h4>
                  <p className="text-sm leading-[170%] text-white/80 md:text-base">{item.body}</p>
                  <Link href="/" className="feelvie-link-mood text-sm font-semibold text-white/80 transition-all duration-300 ease-out hover:scale-105 hover:text-white">
                    Learn more
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div
            className="hiw-list-panel hiw-list-card hiw-delay-4 min-h-[300px] w-full rounded-[40px] border border-white/10 md:min-h-[400px]"
            style={{ maxWidth: 536 }}
          />
        </div>
      </section>

      {/* FAQ — bg #05050A */}
      <section
        ref={faqRef}
        className={`hiw-section relative z-10 flex flex-col items-center gap-20 px-8 py-28 md:px-16 ${inView.has("faq") ? "hiw-in-view" : ""}`}
        style={{ background: "#05050A" }}
      >
        <div className="hiw-faq-item hiw-delay-0 flex max-w-[768px] flex-col items-center gap-6 text-center">
          <h2 className="feelvie-title text-4xl font-semibold leading-[120%] text-white md:text-5xl lg:text-[60px]">
            Frequently asked questions
          </h2>
          <p className="text-lg leading-[170%] text-white/80 md:text-xl">
            Everything you need to know about how Feelvie works
          </p>
        </div>
        <ul className="flex w-full max-w-[820px] flex-col gap-6">
          {FAQ.map((item, i) => (
            <li key={item.q} className={`hiw-faq-item ${["hiw-delay-1", "hiw-delay-2", "hiw-delay-3", "hiw-delay-4", "hiw-delay-5"][i]} feelvie-card-muted flex flex-col gap-3 p-6 transition-all duration-300 ease-out hover:bg-white/[0.08]`}>
              <h3 className="text-lg font-semibold leading-[160%] text-white">{item.q}</h3>
              <p className="text-sm leading-[170%] text-white/80 md:text-base">{item.a}</p>
            </li>
          ))}
        </ul>
        <div className="hiw-faq-item hiw-delay-6 flex max-w-[560px] flex-col items-center gap-6 text-center">
          <h4 className="feelvie-title text-3xl font-semibold leading-[120%] text-white md:text-4xl">
            More questions?
          </h4>
          <p className="text-lg leading-[170%] text-white/80 md:text-xl">
            Reach out and we&apos;ll help.
          </p>
          <Link
            href="/contact"
            className="feelvie-button-ghost rounded-full px-6 py-2.5 text-lg font-medium text-white transition-all duration-300 ease-out hover:scale-105"
          >
            Contact us
          </Link>
        </div>
      </section>

      {/* CTA — bg #05050A */}
      <section
        ref={ctaRef}
        className={`relative z-10 flex flex-col items-center gap-16 px-8 py-28 md:px-16 ${inView.has("cta") ? "hiw-animate hiw-in-view hiw-fade-up" : "hiw-animate hiw-fade-up"}`}
        style={{ background: "#05050A" }}
      >
        <div className="flex max-w-[820px] flex-col items-center gap-6 text-center">
          <h2 className="feelvie-title text-4xl font-semibold leading-[120%] text-white md:text-5xl lg:text-[60px]">
            Ready to discover
          </h2>
          <p className="text-lg leading-[170%] text-white/80 md:text-xl">
            Start searching by feeling right now or explore what others are watching.
          </p>
          <div className="flex flex-row items-center gap-4">
            <Link
              href="/"
              className="feelvie-button rounded-full px-6 py-2.5 text-lg font-medium text-white transition-all duration-300 ease-out hover:scale-105 active:scale-95"
            >
              Sign in
            </Link>
            <Link
              href="/"
              className="feelvie-button-ghost rounded-full px-6 py-2.5 text-lg font-medium text-white transition-all duration-300 ease-out hover:scale-105"
            >
              Create account
            </Link>
          </div>
        </div>
        <div className="feelvie-card h-[320px] w-full max-w-[1280px] rounded-[28px] bg-gradient-to-br from-white/10 via-transparent to-transparent md:h-[420px] lg:h-[720px]" />
      </section>
    </div>
  );
}
