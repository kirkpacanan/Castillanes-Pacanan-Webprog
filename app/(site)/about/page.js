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
    <div
      className="min-h-screen overflow-x-hidden bg-slate-100 dark:bg-[#350A0A]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* About Us – no background, text on page */}
      <section className="relative z-10 px-4 py-16 md:py-20">
        <div className="about-section-in mx-auto w-[min(1280px,94%)] text-center" style={{ animationDelay: "0.1s" }}>
          <h1
            className="text-4xl font-bold leading-[160%] text-slate-900 dark:text-white md:text-6xl lg:text-[84px]"
            style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
          >
            About Us
          </h1>
          <p className="mx-auto mt-6 max-w-[772px] text-center text-lg font-medium leading-[160%] text-slate-600 dark:text-white/95 md:text-xl">
            Feelvie is an AI-powered movie discovery platform that generates personalized movie recommendations based on your mood and emotions.
          </p>
        </div>
      </section>

      {/* Our Mission – wide black rectangle to edges of screen */}
      <section className="relative z-10 py-12 md:py-16">
        <div className="relative left-1/2 w-[105vw] max-w-none -translate-x-1/2 px-0">
          <div className="about-section-in rounded-lg bg-slate-800 px-6 py-12 text-center dark:bg-[#05050A] md:rounded-xl md:px-10 md:py-16" style={{ animationDelay: "0.25s" }}>
            <h2
              className="text-3xl font-bold leading-[160%] text-white md:text-5xl lg:text-[60px]"
              style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
            >
              Our Mission
            </h2>
            <p className="mx-auto mt-6 max-w-[772px] text-center text-base font-medium leading-[170%] text-white/95 md:text-xl">
              Our mission is to eliminate decision fatigue in movie selection by using artificial intelligence to understand how users feel and recommend movies that match their emotional state.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different – Group 1, Rectangle 34, border-radius 138px */}
      <section className="relative z-10 px-4 py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1186px]">
          <div className="about-section-in rounded-[80px] bg-slate-800 px-6 py-12 shadow-lg dark:bg-[#05050A] md:rounded-[138px] md:px-12 md:py-16 dark:shadow-[0_4px_4px_rgba(0,0,0,0.25)]" style={{ animationDelay: "0.4s" }}>
            <h2
              className="text-center text-3xl font-bold leading-[160%] text-white md:text-5xl lg:text-[60px]"
              style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
            >
              What Makes Us Different
            </h2>
            <p className="mx-auto mt-6 max-w-[929px] text-center text-base font-medium leading-[170%] text-white/95 md:text-xl">
              We stand out by combining intelligent, mood-based AI recommendations with a highly personalized movie discovery experience, all delivered through a clean, minimal interface. Our platform is designed for fast and efficient browsing, making it easy for users to find the right movie at the right moment—without distractions.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="about-section-in flex flex-col items-center text-center"
                  style={{ animationDelay: `${0.5 + i * 0.08}s` }}
                >
                  <span className="text-white">
                    <FeatureIcon type={f.icon} />
                  </span>
                  <p className="mt-4 text-base font-medium leading-[160%] text-white md:text-xl">
                    {f.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Developers */}
      <section className="relative z-10 px-4 py-16 md:py-20">
        <div className="mx-auto w-[min(1280px,94%)] text-center">
          <h2
            className="about-section-in text-3xl font-bold leading-[160%] text-slate-900 dark:text-white md:text-5xl lg:text-[60px]"
            style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)", animationDelay: "0.55s" }}
          >
            Meet the Developers
          </h2>

          <div className="mx-auto mt-12 flex max-w-[900px] flex-wrap justify-center gap-8 overflow-visible md:gap-12">
            {DEVELOPERS.map((dev, i) => (
              <div
                key={dev.name}
                className="about-dev-card about-section-in flex w-[288px] flex-col items-center rounded-[64px] bg-slate-800 px-6 py-10 shadow-lg dark:bg-[#05050A] md:min-h-[344px] dark:shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
                style={{ animationDelay: `${0.7 + i * 0.15}s` }}
              >
                <div className="about-dev-float h-24 w-24 rounded-full bg-white/10" aria-hidden />
                <p className="mt-6 text-lg font-bold leading-[160%] text-slate-900 dark:text-white md:text-xl">
                  {dev.name}
                </p>
              </div>
            ))}
          </div>

          <p className="about-section-in mx-auto mt-10 max-w-[889px] text-center text-base font-medium leading-[160%] text-slate-700 dark:text-white md:text-xl" style={{ animationDelay: "1s" }}>
            {DEVELOPERS[0].bio}
          </p>

          <Link
            href="/contact"
            className="about-section-in mt-12 inline-flex items-center justify-center rounded-full bg-slate-600 px-8 py-3 text-lg font-medium leading-[160%] text-white transition hover:opacity-90 dark:bg-white/10 dark:hover:bg-white/15"
            style={{ animationDelay: "1.15s" }}
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
