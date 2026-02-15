"use client";

import Link from "next/link";

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
  return (
    <div className="flex flex-col items-stretch" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header — bg #350A0A, padding 112px 64px */}
      <header className="flex flex-col items-center gap-20 px-8 py-28 md:px-16" style={{ background: "#350A0A" }}>
        <div className="flex max-w-[768px] flex-col items-center gap-8 text-center">
          <p className="text-base font-semibold leading-[150%] text-white">Process</p>
          <h1 className="text-5xl font-bold leading-[110%] tracking-[0.01em] text-white md:text-7xl md:leading-[110%]">
            How it works
          </h1>
          <p className="max-w-[768px] text-xl font-normal leading-[160%] text-white">
            Feelvie strips away the noise of traditional categories. Tell us what you&apos;re feeling, and we&apos;ll find the films that match.
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center rounded-full px-6 py-2.5 text-lg font-medium text-white"
            style={{ background: "#B22222", borderBottom: "4px solid #8E1B1B" }}
          >
            Home
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center rounded-full bg-white/10 px-6 py-2.5 text-lg font-medium text-white"
          >
            Movie suggestion
          </Link>
        </div>
      </header>

      {/* Layout 237 — bg #05050A, 3 columns */}
      <section className="flex flex-col items-center gap-20 px-8 py-28 md:px-16" style={{ background: "#05050A" }}>
        <div className="flex max-w-[768px] flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-bold leading-[120%] tracking-[0.01em] text-white md:text-5xl lg:text-[60px]">
            The path from feeling to film
          </h2>
          <p className="max-w-[768px] text-xl leading-[160%] text-white">
            No jargon, no complexity. Just you, your emotions, and the movies that understand them.
          </p>
        </div>
        <div className="grid w-full max-w-[1152px] grid-cols-1 gap-12 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="flex flex-col items-center gap-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center">
                <Icon name={step.icon} />
              </div>
              <div className="flex flex-col gap-6">
                <h3 className="text-3xl font-bold leading-[120%] tracking-[0.01em] text-white md:text-4xl">
                  {step.title}
                </h3>
                <p className="text-lg leading-[160%] text-white">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-row items-center gap-6">
          <Link
            href="/"
            className="rounded-full bg-white/10 px-6 py-2.5 text-lg font-medium text-white"
          >
            Learn more
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 rounded-full text-lg font-medium text-white"
          >
            More
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
          </Link>
        </div>
      </section>

      {/* Layout 442 — dark overlay section (two columns) */}
      <section
        className="flex flex-col items-center gap-20 px-8 py-28 md:px-16"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), #1a1a1a" }}
      >
        <div className="grid w-full max-w-[1152px] grid-cols-1 gap-20 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="text-base font-semibold leading-[150%] text-white">Intelligence</p>
            <h2 className="text-4xl font-bold leading-[120%] tracking-[0.01em] text-white md:text-5xl lg:text-[60px]">
              Technology that understands emotion
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-8">
            <p className="max-w-[536px] text-xl leading-[160%] text-white">
              Behind every recommendation is sentiment analysis, emotional mapping, and a curated database of films. Feelvie doesn&apos;t just predict what you want—it understands what you need.
            </p>
            <div className="flex flex-row items-center gap-6">
              <Link href="/" className="rounded-full bg-white/10 px-6 py-2.5 text-lg font-medium text-white">
                Discover
              </Link>
              <Link href="/about" className="flex items-center gap-2 text-lg font-medium text-white">
                More
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Layout 31 — bg #350A0A, list + placeholder image */}
      <section className="flex flex-col items-center gap-20 px-8 py-28 md:px-16" style={{ background: "#350A0A" }}>
        <div className="grid w-full max-w-[1152px] grid-cols-1 gap-20 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {LIST_ITEMS.map((item) => (
                <div key={item.title} className="flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center">
                    <Icon name={item.icon} />
                  </div>
                  <h4 className="text-2xl font-bold leading-[120%] tracking-[0.01em] text-white md:text-[32px]">
                    {item.title}
                  </h4>
                  <p className="text-lg leading-[160%] text-white">{item.body}</p>
                  <Link href="/" className="text-lg font-medium text-white underline">
                    Learn more
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div
            className="min-h-[300px] w-full rounded-[40px] bg-white/10 md:min-h-[400px]"
            style={{ maxWidth: 536 }}
          />
        </div>
      </section>

      {/* FAQ — bg #05050A */}
      <section className="flex flex-col items-center gap-20 px-8 py-28 md:px-16" style={{ background: "#05050A" }}>
        <div className="flex max-w-[768px] flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-bold leading-[120%] tracking-[0.01em] text-white md:text-5xl lg:text-[60px]">
            Frequently asked questions
          </h2>
          <p className="text-xl leading-[160%] text-white">
            Everything you need to know about how Feelvie works
          </p>
        </div>
        <ul className="flex w-full max-w-[768px] flex-col gap-12">
          {FAQ.map((item) => (
            <li key={item.q} className="flex flex-col gap-4">
              <h3 className="text-xl font-bold leading-[160%] text-white">{item.q}</h3>
              <p className="text-lg leading-[160%] text-white">{item.a}</p>
            </li>
          ))}
        </ul>
        <div className="flex max-w-[560px] flex-col items-center gap-6 text-center">
          <h4 className="text-3xl font-bold leading-[120%] tracking-[0.01em] text-white md:text-4xl">
            More questions?
          </h4>
          <p className="text-xl leading-[160%] text-white">
            Reach out and we&apos;ll help.
          </p>
          <Link
            href="/contact"
            className="rounded-full bg-white/10 px-6 py-2.5 text-lg font-medium text-white"
          >
            Contact us
          </Link>
        </div>
      </section>

      {/* CTA — bg #05050A */}
      <section className="flex flex-col items-center gap-20 px-8 py-28 md:px-16" style={{ background: "#05050A" }}>
        <div className="flex max-w-[768px] flex-col items-center gap-8 text-center">
          <h2 className="text-4xl font-bold leading-[120%] tracking-[0.01em] text-white md:text-5xl lg:text-[60px]">
            Ready to discover
          </h2>
          <p className="text-xl leading-[160%] text-white">
            Start searching by feeling right now or explore what others are watching.
          </p>
          <div className="flex flex-row items-center gap-4">
            <Link
              href="/"
              className="rounded-full px-6 py-2.5 text-lg font-medium text-white"
              style={{ background: "#B22222", borderBottom: "4px solid #8E1B1B" }}
            >
              Sign in
            </Link>
            <Link
              href="/"
              className="rounded-full bg-white/10 px-6 py-2.5 text-lg font-medium text-white"
            >
              Create account
            </Link>
          </div>
        </div>
        <div className="h-[320px] w-full max-w-[1280px] rounded-lg bg-white/10 md:h-[420px] lg:h-[720px]" />
      </section>
    </div>
  );
}
