"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "feelvie_user";

const AuthContext = createContext(null);

function userFromSupabaseSession(session) {
  if (!session?.user) return null;
  const u = session.user;
  const name = u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "User";
  return { name, email: u.email ?? null, id: u.id };
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUserState(userFromSupabaseSession(session));
        } else {
          try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed?.name) setUserState({ name: parsed.name, email: parsed.email });
            }
          } catch (_) {}
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setUserState(userFromSupabaseSession(session));
          try {
            const u = userFromSupabaseSession(session);
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
          } catch (_) {}
        } else {
          setUserState(null);
          try {
            window.localStorage.removeItem(STORAGE_KEY);
          } catch (_) {}
        }
      });

      setHydrated(true);
      return () => subscription?.unsubscribe();
    } else {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.name) setUserState({ name: parsed.name, email: parsed.email });
        }
      } catch (_) {}
      setHydrated(true);
    }
  }, [supabase]);

  const setUser = useCallback((value) => {
    setUserState(value);
    try {
      if (value) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (_) {}
  }, []);

  const signIn = useCallback((name, email) => {
    setUser({ name: name?.trim() || "User", email: email?.trim() || null });
  }, [setUser]);

  const signInWithGoogle = useCallback(() => {
    if (!supabase) return;
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || "";
    const redirectTo = `${origin}/auth/callback`;
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  }, [supabase]);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setUserState(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }, [supabase]);

  const value = {
    user: hydrated ? user : null,
    setUser,
    signIn,
    signInWithGoogle,
    signOut,
    hydrated,
    hasSupabase: !!supabase,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
