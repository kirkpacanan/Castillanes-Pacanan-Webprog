"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import TermsModal from "../../components/TermsModal";
import PrivacyModal from "../../components/PrivacyModal";

export default function SignUpPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, user, hydrated, hasSupabase } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username.trim(),
          email: email.trim() || null,
          password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Sign up failed. Please try again.");
        setLoading(false);
        return;
      }
      signIn(data.user?.name ?? username.trim(), (data.user?.email ?? email.trim()) || null);
      router.push("/");
    } catch (_) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="feelvie-page relative min-h-screen">
      <div className="feelvie-ambient" aria-hidden>
        <div className="feelvie-ambient-spot feelvie-ambient-spot-1" />
        <div className="feelvie-ambient-spot feelvie-ambient-spot-2" />
        <div className="feelvie-grid" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-md px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="feelvie-title text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
          Sign up to Feelvie
        </h1>
      {hasSupabase ? (
        <>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="feelvie-button-ghost mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_12px_rgba(178,34,34,0.3)]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          <p className="mt-4 text-center text-xs text-white/50">or sign up with email</p>
        </>
      ) : (
        <p className="mt-6 text-center text-xs text-white/50">
          {process.env.NODE_ENV === "development"
            ? "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server to see \"Continue with Google\"."
            : "Sign up with email below."}
        </p>
      )}
      <form onSubmit={handleSubmit} className={`feelvie-card flex flex-col gap-5 p-6 ${hasSupabase ? "mt-6" : "mt-8"}`}>
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}
        <label className="text-sm font-semibold text-white/90">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="feelvie-input rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:ring-2"
          required
        />
        <label className="text-sm font-semibold text-white/90">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="feelvie-input rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:ring-2"
        />
        <label className="text-sm font-semibold text-white/90">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="feelvie-input rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:ring-2"
        />
        <p className="text-xs text-white/60">
          By clicking Sign Up, you agree to Feelvie&apos;s
          {' '}
          <button type="button" onClick={() => setShowTerms(true)} className="feelvie-link-mood underline transition-all duration-300 ease-out hover:scale-105">
            Terms of Service
          </button>
          {' '} (including arbitration provisions) and acknowledge that you have read our {' '}
          <button type="button" onClick={() => setShowPrivacy(true)} className="feelvie-link-mood underline transition-all duration-300 ease-out hover:scale-105">
            Privacy Policy
          </button>
          .
        </p>
        <button
          type="submit"
          disabled={loading}
          className="feelvie-button mt-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(178,34,34,0.5)] active:scale-95 disabled:opacity-60 disabled:pointer-events-none disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {loading ? "Creating account…" : "Sign Up"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/70">
        Already have an account?{" "}
        <Link href="/signin" className="feelvie-link-mood font-semibold transition-all duration-300 ease-out hover:scale-105">
          Sign in
        </Link>
      </p>
      <p className="mt-4 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-white/70 transition-all duration-300 ease-out hover:scale-105 hover:text-white"
        >
          Continue as Guest
        </Link>
      </p>
      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} />
      </div>
    </div>
  );
}
