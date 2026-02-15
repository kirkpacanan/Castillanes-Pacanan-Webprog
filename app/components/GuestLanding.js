"use client";

import { useState } from "react";

export default function GuestLanding({ onSignIn, theme, onToggleTheme }) {
  const [showAuth, setShowAuth] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSignIn(name.trim(), email.trim() || null);
    setShowAuth(false);
    setName("");
    setEmail("");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.12),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.25),_transparent_55%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-[min(1280px,94%)] flex-col py-10 md:py-14">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-red-600 dark:text-red-500">
            <span className="h-2 w-2 rounded-full bg-red-600" />
            Feelvie
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleTheme}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-500 hover:text-slate-900 dark:border-white/20 dark:text-white/80 dark:hover:border-red-500 dark:hover:text-white"
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <button
              type="button"
              onClick={() => { setShowAuth(true); setIsSignUp(false); }}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-500 hover:text-slate-900 dark:border-white/20 dark:text-white/80 dark:hover:border-red-500 dark:hover:text-white"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => { setShowAuth(true); setIsSignUp(true); }}
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Sign up
            </button>
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white md:text-6xl">
            Feelvie
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-white/70">
            Describe your mood, vibe, or storyline. Get AI-powered movie recommendations and chat with Feelvie to find something that fits how you feel.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => { setShowAuth(true); setIsSignUp(true); }}
              className="rounded-full bg-red-600 px-8 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-500"
            >
              Get started
            </button>
            <button
              type="button"
              onClick={() => { setShowAuth(true); setIsSignUp(false); }}
              className="rounded-full border-2 border-slate-300 px-8 py-4 text-base font-semibold text-slate-700 transition hover:border-red-500 hover:text-slate-900 dark:border-white/20 dark:text-white/80 dark:hover:border-red-500 dark:hover:text-white"
            >
              Sign in
            </button>
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {["AI keyword analysis", "OMDb movie data", "Mood chat"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-white/20 dark:text-white/70"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>

      {showAuth && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowAuth(false)}
          role="dialog"
          aria-modal="true"
          aria-label={isSignUp ? "Sign up" : "Sign in"}
        >
          <div
            className="glass w-full max-w-md rounded-3xl p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isSignUp ? "Create account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
              {isSignUp ? "Enter your details to get started." : "Sign in to access your recommendations and mood chat."}
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <label className="text-sm font-semibold text-slate-600 dark:text-white/70">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none ring-red-500/30 transition focus:ring-2 dark:border-white/15 dark:bg-black/60 dark:text-white"
                required
              />
              {isSignUp && (
                <>
                  <label className="text-sm font-semibold text-slate-600 dark:text-white/70">
                    Email <span className="text-slate-400">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none ring-red-500/30 transition focus:ring-2 dark:border-white/15 dark:bg-black/60 dark:text-white"
                  />
                </>
              )}
              <div className="mt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-500"
                >
                  {isSignUp ? "Sign up" : "Sign in"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuth(false)}
                  className="rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/20 dark:text-white/80"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
