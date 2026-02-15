"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const STORAGE_PREFIX = "feelvie_watchlist";

function storageKey(user) {
  const id = user?.name ?? "guest";
  return `${STORAGE_PREFIX}_${id}`;
}

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const { user, hydrated } = useAuth();
  const [watchList, setWatchList] = useState([]);
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    if (!hydrated || !user) return;
    try {
      const key = storageKey(user);
      const rawList = window.localStorage.getItem(`${key}_list`);
      const rawWatched = window.localStorage.getItem(`${key}_watched`);
      if (rawList) setWatchList(JSON.parse(rawList));
      if (rawWatched) setWatched(JSON.parse(rawWatched));
    } catch (_) {}
  }, [user, hydrated]);

  useEffect(() => {
    if (!user || !hydrated) return;
    try {
      const key = storageKey(user);
      window.localStorage.setItem(`${key}_list`, JSON.stringify(watchList));
      window.localStorage.setItem(`${key}_watched`, JSON.stringify(watched));
    } catch (_) {}
  }, [user, hydrated, watchList, watched]);

  const addToWatchList = useCallback((movie) => {
    if (!movie?.imdbID) return;
    setWatchList((prev) => {
      if (prev.some((m) => m.imdbID === movie.imdbID)) return prev;
      return [...prev, movie];
    });
    setWatched((prev) => prev.filter((m) => m.imdbID !== movie.imdbID));
  }, []);

  const removeFromWatchList = useCallback((imdbID) => {
    setWatchList((prev) => prev.filter((m) => m.imdbID !== imdbID));
  }, []);

  const markWatched = useCallback((movie) => {
    if (!movie?.imdbID) return;
    setWatched((prev) => {
      if (prev.some((m) => m.imdbID === movie.imdbID)) return prev;
      return [...prev, movie];
    });
    setWatchList((prev) => prev.filter((m) => m.imdbID !== movie.imdbID));
  }, []);

  const isInWatchList = useCallback(
    (imdbID) => watchList.some((m) => m.imdbID === imdbID),
    [watchList]
  );
  const isWatched = useCallback(
    (imdbID) => watched.some((m) => m.imdbID === imdbID),
    [watched]
  );

  const value = {
    watchList,
    watched,
    addToWatchList,
    removeFromWatchList,
    markWatched,
    isInWatchList,
    isWatched,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
}
