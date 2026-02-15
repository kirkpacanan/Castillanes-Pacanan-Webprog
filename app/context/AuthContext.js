"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "feelvie_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name) setUserState({ name: parsed.name, email: parsed.email });
      }
    } catch (_) {}
    setHydrated(true);
  }, []);

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

  const signOut = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const value = {
    user: hydrated ? user : null,
    setUser,
    signIn,
    signOut,
    hydrated
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
