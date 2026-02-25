"use client";

import Link from "next/link";

const DEVELOPERS = [
  {
    name: "Nicholas Klein Y. Castillanes",
    bio: "2nd Year Student at Mapúa Malayan Colleges Mindanao BSCS. Passionate about building AI-powered experiences and clean, user-focused interfaces.",
  },
  {
    name: "Kirk Roden C. Pacanan",
    bio: "2nd Year Student at Mapúa Malayan Colleges Mindanao BSCS. Passionate about building AI-powered experiences and clean, user-focused interfaces.",
  },
];

const FEATURES = [
  { title: "AI-powered mood-based recommendations", icon: "robot" },
  { title: "Personalized movie discovery", icon: "movie" },
  { title: "Clean and minimal user interface", icon: "apps" },
  { title: "Fast and efficient browsing", icon: "browse" },
];

const SNAPSHOT = [
  { title: "Mood-first matching", body: "Every prompt is analyzed for tone and intent." },
  { title: "Curated discovery", body: "Films are aligned with emotional context, not just genre." },
  { title: "Designed for focus", body: "A minimal interface keeps the experience calm and clear." }
];

function FeatureIcon({ type }) {
  const cls = "h-16 w-16 flex-shrink-0 text-white md:h-20 md:w-20";
  if (type === "robot") {
    return (
      <svg className={cls} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1c2.76 0 5 2.24 5 5h1c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2h-1v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-1H2c-1.1 0-2-.9-2-2v-3c0-1.1.9-2 2-2h1c0-2.76 2.24-5 5-5h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM7.5 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM8 11h8v2H8v-2z" />
      </svg>
    );
  }
  if (type === "movie") {
    return (
      <svg className={cls} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
      </svg>
    );
  }
  if (type === "apps") {
    return (
      <svg className={cls} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0-6h4V4h-4v4z" />
      </svg>
    );
  }
  if (type === "browse") {
    return (
      <svg className={cls} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
      </svg>
    );
  }
  return null;
}

export default function AboutPage() {
  return (
    <div className="feelvie-page relative min-h-screen overflow-x-hidden">
      <div className="feelvie-ambient" aria-hidden>
        <div className="feelvie-ambient-spot feelvie-ambient-spot-1" />
        <div className="feelvie-ambient-spot feelvie-ambient-spot-2" />
        <div className="feelvie-grid" />
      </div>

      {/* Hero */}
      <section className="relative z-10 px-4 sm:px-6 pt-12 sm:pt-20 pb-8 sm:pb-12 md:pt-28">
        <div className="about-section-in mx-auto grid w-full max-w-[1200px] items-center gap-8 sm:gap-10 md:grid-cols-[1.15fr_0.85fr]" style={{ animationDelay: "0.1s" }}>
          <div className="flex flex-col gap-4 sm:gap-6 text-left">
            <p className="feelvie-kicker">About Feelvie</p>
            <h1 className="feelvie-title text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold leading-[120%] text-white">
              A calmer way to discover films.
            </h1>
            <p className="max-w-[680px] text-base sm:text-lg md:text-xl leading-[170%] text-white/85">
              Feelvie is an AI-powered movie discovery platform that generates personalized recommendations based on your mood and emotions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/how-it-works"
                className="feelvie-button inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm sm:text-base font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(178,34,34,0.5)] active:scale-95"
              >
                See how it works
              </Link>
              <Link
                href="/contact"
                className="feelvie-button-ghost inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm sm:text-base font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_12px_rgba(178,34,34,0.3)]"
              >
                Contact us
              </Link>
            </div>
          </div>
          <div className="feelvie-card flex flex-col gap-5 sm:gap-6 p-5 sm:p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Project snapshot</p>
            <div className="flex flex-col gap-5">
              {SNAPSHOT.map((item) => (
                <div key={item.title} className="flex flex-col gap-2">
                  <p className="text-base font-semibold text-white">{item.title}</p>
                  <p className="text-sm leading-[170%] text-white/70">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission – wide black rectangle to edges of screen */}
      <section className="relative z-10 px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="about-section-in mx-auto w-full max-w-[1200px]" style={{ animationDelay: "0.25s" }}>
          <div className="feelvie-card flex flex-col gap-5 sm:gap-6 p-6 sm:p-8 md:p-12 text-left transition-all duration-300 ease-out hover:shadow-[0_8px_24px_rgba(178,34,34,0.3)] hover:border-red-500/30">
            <p className="feelvie-kicker">Our mission</p>
            <h2 className="feelvie-title text-2xl sm:text-3xl md:text-5xl lg:text-[60px] font-semibold leading-[130%] text-white">
              Eliminate decision fatigue by honoring how people feel.
            </h2>
            <p className="max-w-[860px] text-sm sm:text-base md:text-lg leading-[175%] text-white/80">
              Our mission is to reduce decision fatigue in movie selection by using artificial intelligence to understand how users feel and recommend films that match their emotional state.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different – Group 1, Rectangle 34, border-radius 138px */}
      <section className="relative z-10 px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="about-section-in flex flex-col gap-6 sm:gap-8" style={{ animationDelay: "0.4s" }}>
            <div className="flex flex-col gap-3 sm:gap-4 text-left">
              <p className="feelvie-kicker">What makes us different</p>
              <h2 className="feelvie-title text-2xl sm:text-3xl md:text-5xl lg:text-[60px] font-semibold leading-[130%] text-white">
                Emotion-led discovery, refined and focused.
              </h2>
              <p className="max-w-[940px] text-sm sm:text-base md:text-lg leading-[175%] text-white/80">
                We combine intelligent, mood-based recommendations with a clean, minimal interface. The platform is designed for fast, focused browsing, making it easy to find the right film at the right moment.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="about-section-in feelvie-card flex flex-col items-start gap-4 p-6 transition-all duration-300 ease-out hover:shadow-[0_8px_24px_rgba(178,34,34,0.3)] hover:scale-[1.02] hover:border-red-500/30"
                  style={{ animationDelay: `${0.5 + i * 0.08}s` }}
                >
                  <span className="text-white">
                    <FeatureIcon type={f.icon} />
                  </span>
                  <p className="text-base font-semibold leading-[160%] text-white md:text-lg">
                    {f.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Developers */}
      <section className="relative z-10 px-6 py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] text-left">
          <h2
            className="about-section-in feelvie-title text-3xl font-semibold leading-[130%] text-white md:text-5xl lg:text-[60px]"
            style={{ animationDelay: "0.55s" }}
          >
            Meet the developers
          </h2>

          <div className="mx-auto mt-10 grid gap-6 md:grid-cols-2">
            {DEVELOPERS.map((dev, i) => (
              <div
                key={dev.name}
                className="about-dev-card about-section-in feelvie-card flex flex-col gap-6 p-6 transition-all duration-300 ease-out hover:shadow-[0_8px_24px_rgba(178,34,34,0.3)] hover:scale-[1.02] hover:border-red-500/30"
                style={{ animationDelay: `${0.7 + i * 0.15}s` }}
              >
                <div className="about-dev-float h-20 w-20 rounded-full bg-white/10" aria-hidden />
                <div className="flex flex-col gap-3">
                  <p className="text-lg font-semibold text-white md:text-xl">{dev.name}</p>
                  <p className="text-sm leading-[170%] text-white/75 md:text-base">{dev.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="about-section-in mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: "1s" }}>
            <div className="feelvie-divider w-full" />
            <Link
              href="/contact"
              className="feelvie-button inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(178,34,34,0.5)] active:scale-95"
            >
              Contact us
            </Link>
            <Link
              href="/how-it-works"
              className="feelvie-button-ghost inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_12px_rgba(178,34,34,0.3)]"
            >
              Read the process
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
