"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, user, hydrated } = useAuth();
  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrUser.trim()) return;
    signIn(emailOrUser.trim(), null);
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
        Sign in to Feelvie
      </h1>
      <p className="mt-4 text-center text-sm text-slate-600 dark:text-white/70">
        Create an account if you don&apos;t have one.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="text-sm font-semibold text-slate-700 dark:text-white/80">
          Email or Username
        </label>
        <input
          type="text"
          value={emailOrUser}
          onChange={(e) => setEmailOrUser(e.target.value)}
          placeholder="Enter your email or username"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-red-500/30 dark:border-white/15 dark:bg-slate-900 dark:text-white"
          required
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
        <button
          type="submit"
          className="mt-4 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-500"
        >
          Sign In
        </button>
        <Link
          href="#"
          className="text-center text-sm text-slate-500 hover:text-red-500 dark:text-white/50 dark:hover:text-red-400"
        >
          Forgot password?
        </Link>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-white/70">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-red-600 hover:underline dark:text-red-400">
          Sign up
        </Link>
      </p>
    </div>
  );
}
