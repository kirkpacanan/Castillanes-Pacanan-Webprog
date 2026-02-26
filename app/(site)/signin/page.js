"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, user, hydrated, hasSupabase } = useAuth();
  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "auth") setAuthError("Sign-in was cancelled or failed. Please try again.");
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    if (!emailOrUser.trim() || !password) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername: emailOrUser.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAuthError(data.error || "Sign-in failed. Please try again.");
        setLoading(false);
        return;
      }
      signIn(data.user?.name ?? emailOrUser.trim(), data.user?.email ?? null);
      router.push("/");
    } catch (_) {
      setAuthError("Something went wrong. Please try again.");
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
          Sign in to Feelvie
        </h1>
        <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-white/70">
          Create an account if you don&apos;t have one.
        </p>
      {authError && (
        <div className="feelvie-card mt-4 sm:mt-6 border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-xs sm:text-sm text-red-200">{authError}</p>
        </div>
      )}
      {hasSupabase ? (
        <>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="feelvie-button-ghost mt-6 sm:mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_12px_rgba(178,34,34,0.3)]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          <p className="mt-3 sm:mt-4 text-center text-xs text-white/50">or sign in with email</p>
        </>
      ) : (
        <p className="mt-6 text-center text-xs text-white/50">
          {process.env.NODE_ENV === "development"
            ? "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server to see \"Continue with Google\"."
            : "Sign in with email below."}
        </p>
      )}
      <form onSubmit={handleSubmit} className={`feelvie-card flex flex-col gap-4 sm:gap-5 p-5 sm:p-6 ${hasSupabase ? "mt-4 sm:mt-6" : "mt-6 sm:mt-8"}`}>
        <label className="text-sm font-semibold text-white/90">
          Email or Username
        </label>
        <input
          type="text"
          value={emailOrUser}
          onChange={(e) => setEmailOrUser(e.target.value)}
          placeholder="Enter your email or username"
          className="feelvie-input rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:ring-2"
          required
        />
        <label className="text-xs sm:text-sm font-semibold text-white/90">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="feelvie-input rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder:text-white/40 outline-none transition focus:ring-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="feelvie-button mt-3 sm:mt-4 rounded-xl py-2.5 sm:py-3 text-sm font-semibold text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(178,34,34,0.5)] active:scale-95 disabled:opacity-60 disabled:pointer-events-none disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
        <Link
          href="#"
          className="feelvie-link-mood text-center text-xs sm:text-sm text-white/50 transition-all duration-300 ease-out hover:scale-105"
        >
          Forgot password?
        </Link>
      </form>
      <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-white/70">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="feelvie-link-mood font-semibold transition-all duration-300 ease-out hover:scale-105">
          Sign up
        </Link>
      </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="spinner" aria-label="Loading" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
