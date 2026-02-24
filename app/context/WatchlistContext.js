"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { createClient } from "@/lib/supabase/client";

const STORAGE_PREFIX = "feelvie_watchlist";
const SYNC_DEBOUNCE_MS = 800;

function storageKey(user) {
  const id = user?.name ?? "guest";
  return `${STORAGE_PREFIX}_${id}`;
}

function generatePlaylistId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `pl_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const { user, hydrated } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [watchList, setWatchList] = useState([]);
  const [watched, setWatched] = useState([]);
  const [watchlistPlaylists, setWatchlistPlaylists] = useState([]);
  const [watchedPlaylists, setWatchedPlaylists] = useState([]);
  const [syncReady, setSyncReady] = useState(false);
  const saveTimeoutRef = useRef(null);

  // Reset when signed out
  useEffect(() => {
    if (hydrated && !user) {
      setWatchList([]);
      setWatched([]);
      setWatchlistPlaylists([]);
      setWatchedPlaylists([]);
      setSyncReady(false);
    }
  }, [hydrated, user]);

  // Load: from Supabase when user.id, else from localStorage
  useEffect(() => {
    if (!hydrated || !user) return;
    if (user.id && supabase) {
      supabase
        .from("user_watchlist_sync")
        .select("watchlist, watched, watchlist_playlists, watched_playlists")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            setSyncReady(true);
            return;
          }
          if (data) {
            setWatchList(Array.isArray(data.watchlist) ? data.watchlist : []);
            setWatched(Array.isArray(data.watched) ? data.watched : []);
            setWatchlistPlaylists(Array.isArray(data.watchlist_playlists) ? data.watchlist_playlists : []);
            setWatchedPlaylists(Array.isArray(data.watched_playlists) ? data.watched_playlists : []);
          }
          setSyncReady(true);
        });
    } else {
      try {
        const key = storageKey(user);
        const rawList = window.localStorage.getItem(`${key}_list`);
        const rawWatched = window.localStorage.getItem(`${key}_watched`);
        const rawWatchlistPlaylists = window.localStorage.getItem(`${key}_watchlist_playlists`);
        const rawWatchedPlaylists = window.localStorage.getItem(`${key}_watched_playlists`);
        if (rawList) setWatchList(JSON.parse(rawList));
        if (rawWatched) setWatched(JSON.parse(rawWatched));
        if (rawWatchlistPlaylists) setWatchlistPlaylists(JSON.parse(rawWatchlistPlaylists));
        if (rawWatchedPlaylists) setWatchedPlaylists(JSON.parse(rawWatchedPlaylists));
      } catch (_) {}
      setSyncReady(true);
    }
  }, [user?.id, user?.name, hydrated, supabase]);

  // Save: to Supabase when user.id (debounced), else to localStorage
  const persist = useCallback(
    (list, watchedList, watchlistPlaylistList, watchedPlaylistList) => {
      if (!user || !hydrated) return;
      if (user.id && supabase) {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
          saveTimeoutRef.current = null;
          supabase
            .from("user_watchlist_sync")
            .upsert(
              {
                user_id: user.id,
                watchlist: list ?? [],
                watched: watchedList ?? [],
                watchlist_playlists: watchlistPlaylistList ?? [],
                watched_playlists: watchedPlaylistList ?? [],
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id" }
            )
            .then(({ error }) => {
              if (error) console.error("Watchlist sync error:", error);
            });
        }, SYNC_DEBOUNCE_MS);
      } else {
        try {
          const key = storageKey(user);
          window.localStorage.setItem(`${key}_list`, JSON.stringify(list ?? []));
          window.localStorage.setItem(`${key}_watched`, JSON.stringify(watchedList ?? []));
          window.localStorage.setItem(`${key}_watchlist_playlists`, JSON.stringify(watchlistPlaylistList ?? []));
          window.localStorage.setItem(`${key}_watched_playlists`, JSON.stringify(watchedPlaylistList ?? []));
        } catch (_) {}
      }
    },
    [user, hydrated, supabase]
  );

  useEffect(() => {
    if (!syncReady || !user) return;
    persist(watchList, watched, watchlistPlaylists, watchedPlaylists);
  }, [syncReady, user, watchList, watched, watchlistPlaylists, watchedPlaylists, persist]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

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

  const markUnwatched = useCallback((movie) => {
    if (!movie?.imdbID) return;
    setWatched((prev) => prev.filter((m) => m.imdbID !== movie.imdbID));
  }, []);

  const isInWatchList = useCallback(
    (imdbID) => watchList.some((m) => m.imdbID === imdbID),
    [watchList]
  );
  const isWatched = useCallback(
    (imdbID) => watched.some((m) => m.imdbID === imdbID),
    [watched]
  );

  const createPlaylist = useCallback((name, type = "watchlist") => {
    const trimmed = (name || "").trim();
    if (!trimmed) return null;
    const id = generatePlaylistId();
    const newPlaylist = { id, name: trimmed, movieIds: [] };
    if (type === "watched") {
      setWatchedPlaylists((prev) => [...prev, newPlaylist]);
    } else {
      setWatchlistPlaylists((prev) => [...prev, newPlaylist]);
    }
    return id;
  }, []);

  const deletePlaylist = useCallback((playlistId, type = "watchlist") => {
    if (type === "watched") {
      setWatchedPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    } else {
      setWatchlistPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    }
  }, []);

  const renamePlaylist = useCallback((playlistId, newName, type = "watchlist") => {
    const trimmed = (newName || "").trim();
    if (!trimmed) return;
    if (type === "watched") {
      setWatchedPlaylists((prev) =>
        prev.map((p) => (p.id === playlistId ? { ...p, name: trimmed } : p))
      );
    } else {
      setWatchlistPlaylists((prev) =>
        prev.map((p) => (p.id === playlistId ? { ...p, name: trimmed } : p))
      );
    }
  }, []);

  const addMovieToPlaylist = useCallback((playlistId, imdbID, type = "watchlist") => {
    if (type === "watched") {
      setWatchedPlaylists((prev) =>
        prev.map((p) => {
          if (p.id !== playlistId) return p;
          if (p.movieIds.includes(imdbID)) return p;
          return { ...p, movieIds: [...p.movieIds, imdbID] };
        })
      );
    } else {
      setWatchlistPlaylists((prev) =>
        prev.map((p) => {
          if (p.id !== playlistId) return p;
          if (p.movieIds.includes(imdbID)) return p;
          return { ...p, movieIds: [...p.movieIds, imdbID] };
        })
      );
    }
  }, []);

  const removeMovieFromPlaylist = useCallback((playlistId, imdbID, type = "watchlist") => {
    if (type === "watched") {
      setWatchedPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId ? { ...p, movieIds: p.movieIds.filter((id) => id !== imdbID) } : p
        )
      );
    } else {
      setWatchlistPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId ? { ...p, movieIds: p.movieIds.filter((id) => id !== imdbID) } : p
        )
      );
    }
  }, []);

  const isMovieInPlaylist = useCallback(
    (playlistId, imdbID, type = "watchlist") => {
      const playlists = type === "watched" ? watchedPlaylists : watchlistPlaylists;
      const pl = playlists.find((p) => p.id === playlistId);
      return pl ? pl.movieIds.includes(imdbID) : false;
    },
    [watchlistPlaylists, watchedPlaylists]
  );

  const getPlaylistsContaining = useCallback(
    (imdbID, type = "watchlist") => {
      const playlists = type === "watched" ? watchedPlaylists : watchlistPlaylists;
      return playlists.filter((p) => p.movieIds.includes(imdbID));
    },
    [watchlistPlaylists, watchedPlaylists]
  );

  const value = {
    watchList,
    watched,
    watchlistPlaylists,
    watchedPlaylists,
    addToWatchList,
    removeFromWatchList,
    markWatched,
    markUnwatched,
    isInWatchList,
    isWatched,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    addMovieToPlaylist,
    removeMovieFromPlaylist,
    isMovieInPlaylist,
    getPlaylistsContaining,
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
