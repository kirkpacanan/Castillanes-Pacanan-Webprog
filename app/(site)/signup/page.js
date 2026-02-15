"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { signIn, user, hydrated } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    signIn(username.trim(), email.trim() || null);
    router.push("/");
  };

  if (user) {
    router.replace("/");
    return null;
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-center text-2xl font-bold uppercase tracking-wide text-slate-900 dark:text-white">
        Sign up to Feelvie
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="text-sm font-semibold text-slate-700 dark:text-white/80">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-red-500/30 dark:border-white/15 dark:bg-slate-900 dark:text-white"
          required
        />
        <label className="text-sm font-semibold text-slate-700 dark:text-white/80">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-red-500/30 dark:border-white/15 dark:bg-slate-900 dark:text-white"
        />
        <label className="text-sm font-semibold text-slate-700 dark:text-white/80">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-red-500/30 dark:border-white/15 dark:bg-slate-900 dark:text-white"
        />
        <p className="text-xs text-slate-600 dark:text-white/60">
          By clicking Sign Up, you agree to Feelvie&apos;s Terms of Use (including arbitration provisions) and acknowledge that you have read our Privacy Policy.
        </p>
        <button
          type="submit"
          className="mt-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-500"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-white/70">
        Already have an account?{" "}
        <Link href="/signin" className="font-semibold text-red-600 hover:underline dark:text-red-400">
          Sign in
        </Link>
      </p>
      <p className="mt-4 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
        >
          Continue as Guest
        </Link>
      </p>
    </div>
  );
}
