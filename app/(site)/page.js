"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import PosterPlaceholder from "../components/PosterPlaceholder";
import MovieModal from "../components/MovieModal";
import MoviePosterCard from "../components/MoviePosterCard";
import PlaylistPicker from "../components/PlaylistPicker";
import ClientPortal from "../components/ClientPortal";

const suggestions = [
  "I want a mind-bending sci-fi that feels emotional.",
  "Give me a cozy feel-good movie about friendship.",
  "Something dark and suspenseful with twists.",
  "An inspiring true story that feels hopeful."
];

export default function HomePage() {
  const router = useRouter();
  const { user, signIn, signOut, hydrated } = useAuth();
  const {
    watchList,
    watched,
    watchlistPlaylists,
    watchedPlaylists,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
    addMovieToPlaylist,
    removeMovieFromPlaylist,
    isMovieInPlaylist,
    getPlaylistsContaining,
    addToWatchList,
    removeFromWatchList,
    markWatched,
    isInWatchList,
    isWatched
  } = useWatchlist();
  const [prompt, setPrompt] = useState("");
  const [year, setYear] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [movie, setMovie] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm here to listen. How are you feeling today, and what kind of movie vibe do you want?"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [chatConnected, setChatConnected] = useState(false);
  const [chatEngine, setChatEngine] = useState("gemini");
  const [backgroundPosters, setBackgroundPosters] = useState([]);
  const [cursorGlow, setCursorGlow] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMouseMove = (e) => {
    setCursorGlow({ x: e.clientX, y: e.clientY });
    setCursorVisible(true);
  };
  const handleMouseLeave = () => setCursorVisible(false);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const response = await fetch("/api/posters");
        const payload = await response.json();
        if (response.ok && payload?.posters?.length) {
          setBackgroundPosters(payload.posters);
        }
      } catch (_) {}
    };
    fetchPosters();
  }, []);

  const keywordChips = useMemo(() => {
    if (!analysis) return [];
    const chips = [analysis.genre, analysis.mood, ...(analysis.themes || [])].filter(Boolean);
    return [...new Set(chips)];
  }, [analysis]);

  const posterUrls = useMemo(() => {
    const posters = [
      ...backgroundPosters,
      ...[movie, ...history, ...relatedMovies].map((item) => item?.Poster)
    ].filter((p) => p && p !== "N/A");
    const unique = [...new Set(posters)];
    if (unique.length < 4) return [];
    return [...unique, ...unique, ...unique].slice(0, 18);
  }, [movie, history, relatedMovies, backgroundPosters]);

  const relatedList = useMemo(() => {
    const base = relatedMovies?.length ? relatedMovies : history;
    return base
      .filter((item) => item && (!movie || item.imdbID !== movie.imdbID))
      .slice(0, 25);
  }, [relatedMovies, history, movie]);

  const posterRowItems = useMemo(() => {
    if (posterUrls.length >= 4) return posterUrls;
    return Array(18).fill(null);
  }, [posterUrls]);

  const fetchRecommendation = async (promptText, yearOverride = year) => {
    const response = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: promptText,
        year: yearOverride || null,
        excludeIds: history.map((item) => item.imdbID)
      })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "We could not find a match.");
    return payload;
  };

  const applyRecommendation = (payload, promptText) => {
    setMovie(payload.movie);
    setAnalysis(payload.analysis);
    setRelatedMovies(payload.relatedMovies || []);
    setHistory((prev) => [payload.movie, ...prev].slice(0, 5));
    setLastPrompt(promptText);
  };

  const requestRecommendation = async (promptText) => {
    if (!promptText) {
      setError("Please describe the kind of movie you want.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = await fetchRecommendation(promptText);
      applyRecommendation(payload, promptText);
    } catch (err) {
      setError(err.message || "Unable to reach the recommendation service.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    requestRecommendation(prompt.trim());
  };

  const extractYearFromText = (text) => {
    const match = text.match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : null;
  };

  const sendChatMessage = async (message) => {
    const trimmed = message.trim();
    if (!trimmed) return;
    const detectedYear = extractYearFromText(trimmed);
    if (detectedYear) setYear(detectedYear);
    const nextMessages = [...chatMessages, { role: "user", content: trimmed }];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatLoading(true);
    setChatError("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-8) })
      });
      const payloadText = await response.text();
      const payload = payloadText ? JSON.parse(payloadText) : null;
      if (!response.ok) {
        setChatError(payload?.message || "Chat is unavailable.");
        setChatLoading(false);
        return;
      }
      setChatConnected(true);
      setChatEngine(payload?.engine || "gemini");
      if (payload?.reply) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: payload.reply }]);
      }
      if (payload?.year) setYear(payload.year);
      if (payload?.action === "recommend" && payload.prompt) {
        try {
          const rec = await fetchRecommendation(payload.prompt, payload.year || detectedYear || year);
          applyRecommendation(rec, payload.prompt);
          setChatMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `Based on that, I recommend "${rec.movie.Title}" (${rec.movie.Year}). Want another?`
            }
          ]);
        } catch (_) {
          setChatMessages((prev) => [
            ...prev,
            { role: "assistant", content: "I couldn't find a match. Try a different mood or year?" }
          ]);
        }
      }
    } catch (_) {
      setChatError("Unable to reach the chat service.");
    } finally {
      setChatLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  const showMoodChat = true;

  return (
    <div
      className="page-home relative min-h-screen overflow-hidden bg-slate-100 dark:bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Moving red light – futuristic ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="page-home-red-glow page-home-red-glow-1" aria-hidden />
        <div className="page-home-red-glow page-home-red-glow-2" aria-hidden />
        {/* Cursor-following red glow */}
        <div
          className="page-home-red-glow page-home-red-glow-cursor"
          aria-hidden
          style={{
            left: cursorGlow.x,
            top: cursorGlow.y,
            opacity: cursorVisible ? 0.5 : 0,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      {/* Floating poster rows (opacity 0.4) – behind content */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="poster-row top-[120px]">
          <div className="poster-track">
            {posterRowItems.map((url, i) => (
              <div key={`row1-${i}`} className="poster-card">
                {url ? (
                  <img src={url} alt="" loading="lazy" />
                ) : (
                  <PosterPlaceholder className="h-full w-full" ariaHidden />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="poster-row top-[38%]">
          <div className="poster-track reverse">
            {posterRowItems.map((url, i) => (
              <div key={`row2-${i}`} className="poster-card">
                {url ? (
                  <img src={url} alt="" loading="lazy" />
                ) : (
                  <PosterPlaceholder className="h-full w-full" ariaHidden />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="poster-row top-[72%]">
          <div className="poster-track">
            {posterRowItems.map((url, i) => (
              <div key={`row3-${i}`} className="poster-card">
                {url ? (
                  <img src={url} alt="" loading="lazy" />
                ) : (
                  <PosterPlaceholder className="h-full w-full" ariaHidden />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-3 sm:px-4 pb-16 sm:pb-24 pt-6 sm:pt-10 md:px-8 md:pt-14 animate-fade-in">
        {/* Logo and hero */}
        <section className="text-center">
          <img 
            src="/feelvie-full-logo.png" 
            alt="Feelvie" 
            className="mx-auto h-auto w-auto max-w-[200px] sm:max-w-xs md:max-w-sm"
          />
          <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base leading-[170%] text-white/85 md:text-lg px-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Tell us how you feel, and we&apos;ll match you with films that resonate.
          </p>
        </section>

        {/* Search bar + year */}
        <section className="mx-auto mt-6 sm:mt-10 w-full max-w-[904px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
            <div className="feelvie-card flex h-[70px] sm:h-[92px] items-center gap-2 sm:gap-3 px-4 sm:px-6 transition focus-within:ring-2 focus-within:ring-[#8E1B1B]/50">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type a sentence or phrase."
                className="min-w-0 flex-1 bg-transparent text-base sm:text-xl md:text-2xl text-white placeholder:text-white/50 outline-none"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
              <button
                type="submit"
                disabled={loading}
                className="feelvie-button flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full text-white transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                aria-label="Search"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </button>
            </div>
            <div className="relative w-full max-w-[904px]">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="h-[42px] w-full appearance-none rounded-[50px] border border-white/10 bg-[#1E1E1E]/95 pl-6 pr-10 text-base text-white outline-none transition focus:border-[#8E1B1B]/50 focus:ring-2 focus:ring-[#8E1B1B]/30"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <option value="">Any year</option>
                {Array.from({ length: 50 }, (_, i) => (
                  <option key={i} value={`${new Date().getFullYear() - i}`}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500 dark:text-white/70">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm font-medium text-red-400">{error}</p>
            )}
          </form>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => { setPrompt(item); requestRecommendation(item); }}
                className="feelvie-chip px-4 py-2 text-xs font-medium text-white transition-all duration-300 ease-out hover:bg-[rgba(178,34,34,0.35)] hover:scale-105 hover:shadow-[0_0_12px_rgba(178,34,34,0.4)] active:scale-95"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Main: Result Section (left) + Mood Chat (right) */}
        <section className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
          {/* Result Section */}
          <div className="feelvie-card min-h-[400px] sm:h-[608px] flex flex-col">
            <div className="px-4 pt-4 pb-3 sm:px-6 sm:pt-8 sm:pb-4 flex-shrink-0">
              <h2 className="feelvie-title text-xl sm:text-2xl md:text-[32px] font-semibold tracking-tight text-white md:leading-[39px]">
                Recommended movie
              </h2>
            </div>
            <div className="flex flex-1 min-h-0 w-full flex-col md:flex-row md:gap-3">
              {!movie && (
              <div className="flex flex-1 items-center justify-center px-6 py-8 text-center">
                <div>
                  <div className="mb-4 flex justify-center">
                    <div className="aspect-[2/3] w-40 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-800">
                      <PosterPlaceholder className="aspect-[2/3] w-full" />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300 dark:text-white/80">
                    Submit a prompt or pick a suggestion above to get a personalized movie recommendation.
                  </p>
                </div>
              </div>
            )}
            {movie && (
              <>
                {/* Left: Fixed Poster Container */}
                <div className="shrink-0 flex items-start justify-start px-4 py-4 md:px-6 md:py-0">
                  <div className="w-40 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-800 sm:w-44 md:w-48 translate-x-2">
                    {movie.Poster && movie.Poster !== "N/A" ? (
                      <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="aspect-[2/3] w-full object-cover scale-115"
                      />
                    ) : (
                      <PosterPlaceholder className="aspect-[2/3] w-full scale-115" />
                    )}
                  </div>
                </div>

                {/* Right: Scrollable Details */}
                <div className="modal-scroll flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 pr-4 md:px-2 md:pb-6 md:pr-6">
                  <div className="flex flex-col gap-3 pb-4 sm:pb-6 md:pb-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-red-500 dark:text-red-400">
                      {movie.Genre || "Movie"}
                    </p>
                    <h2 className="text-2xl font-bold text-white md:text-3xl">
                      {movie.Title}
                    </h2>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-400 dark:text-white/70">
                      <span>{movie.Year}</span>
                      {movie.Runtime && <span>•</span>}
                      <span>{movie.Runtime}</span>
                      {movie.imdbRating && <span>•</span>}
                      <span>⭐ {movie.imdbRating}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300 dark:text-white/80">
                      {movie.Plot || "No description available."}
                    </p>

                    {/* Director */}
                    {movie.Director && movie.Director !== "N/A" && (
                      <div className="mt-0 flex flex-col gap-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                          Director
                        </p>
                        <p className="text-sm text-slate-300 dark:text-white/80">
                          {movie.Director}
                        </p>
                      </div>
                    )}

                    {/* Cast */}
                    {movie.Actors && movie.Actors !== "N/A" && (
                      <div className="mt-0 flex flex-col gap-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                          Cast
                        </p>
                        <p className="text-sm leading-relaxed text-slate-300 dark:text-white/80">
                          {movie.Actors}
                        </p>
                      </div>
                    )}

                    {/* Keyword Chips */}
                    {keywordChips.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {keywordChips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 dark:text-red-300 transition-all duration-300 ease-out hover:bg-red-500/20 hover:scale-110 hover:shadow-[0_0_8px_rgba(220,38,38,0.5)] cursor-default"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Guest: Sign in prompt */}
                    {!user && (
                      <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 transition-all duration-300">
                        <p className="text-sm text-white/90">
                          Want to save this movie to your Watchlist or mark it as Watched? Sign in to start tracking your movies!
                        </p>
                        <button
                          type="button"
                          onClick={() => router.push("/signin")}
                          className="mt-3 w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:scale-105 hover:brightness-110 hover:shadow-[0_0_20px_rgba(178,34,34,0.6)] active:scale-95"
                        >
                          Sign In
                        </button>
                      </div>
                    )}

                    {/* Logged-in: Full controls */}
                    {user && (
                      <>
                        {/* Watchlist Section */}
                        <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                            Watch list
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                isInWatchList(movie.imdbID)
                                  ? removeFromWatchList(movie.imdbID)
                                  : addToWatchList(movie)
                              }
                              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ease-out hover:scale-105 ${
                                isInWatchList(movie.imdbID)
                                  ? "border border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                                  : "border border-white/20 text-white/80 hover:border-red-500 hover:text-white hover:shadow-[0_0_12px_rgba(178,34,34,0.3)]"
                              }`}
                            >
                              {isInWatchList(movie.imdbID) ? "✓ In Watch list" : "Add to Watch list"}
                            </button>
                            {isInWatchList(movie.imdbID) && (
                              <PlaylistPicker
                                imdbID={movie.imdbID}
                                playlists={watchlistPlaylists}
                                getPlaylistsContaining={(id) => getPlaylistsContaining(id, "watchlist")}
                                isMovieInPlaylist={(pId, id) => isMovieInPlaylist(pId, id, "watchlist")}
                                addMovieToPlaylist={(pId, id) => addMovieToPlaylist(pId, id, "watchlist")}
                                removeMovieFromPlaylist={(pId, id) => removeMovieFromPlaylist(pId, id, "watchlist")}
                                createPlaylist={(name) => createPlaylist(name, "watchlist")}
                                renamePlaylist={(pId, name) => renamePlaylist(pId, name, "watchlist")}
                                deletePlaylist={(pId) => deletePlaylist(pId, "watchlist")}
                                label="Playlists"
                                type="watchlist"
                              />
                            )}
                          </div>
                        </div>

                        {/* Watched Section */}
                        <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                            Watched
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => markWatched(movie)}
                              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ease-out hover:scale-105 ${
                                isWatched(movie.imdbID)
                                  ? "border border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                                  : "border border-white/20 text-white/80 hover:border-red-500 hover:text-white hover:shadow-[0_0_12px_rgba(178,34,34,0.3)]"
                              }`}
                            >
                              {isWatched(movie.imdbID) ? "✓ Watched" : "Mark as Watched"}
                            </button>
                            {isWatched(movie.imdbID) && (
                              <PlaylistPicker
                                imdbID={movie.imdbID}
                                playlists={watchedPlaylists}
                                getPlaylistsContaining={(id) => getPlaylistsContaining(id, "watched")}
                                isMovieInPlaylist={(pId, id) => isMovieInPlaylist(pId, id, "watched")}
                                addMovieToPlaylist={(pId, id) => addMovieToPlaylist(pId, id, "watched")}
                                removeMovieFromPlaylist={(pId, id) => removeMovieFromPlaylist(pId, id, "watched")}
                                createPlaylist={(name) => createPlaylist(name, "watched")}
                                renamePlaylist={(pId, name) => renamePlaylist(pId, name, "watched")}
                                deletePlaylist={(pId) => deletePlaylist(pId, "watched")}
                                label="Playlists"
                                type="watched"
                              />
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          </div>

          {/* Mood Chat */}
          {showMoodChat && (
            <aside className="feelvie-card min-h-[608px] p-6 md:p-8">
              <div 
                className="rounded-xl px-4 py-3"
                style={{ 
                  background: "rgba(178, 34, 34, 0.15)",
                  border: "1px solid rgba(178, 34, 34, 0.3)",
                  boxShadow: "0 0 30px rgba(178, 34, 34, 0.6), 0 0 60px rgba(178, 34, 34, 0.3), inset 0 0 20px rgba(178, 34, 34, 0.1)" 
                }}
              >
                <h2 className="feelvie-title text-xl font-semibold text-white">
                  Mood Chat
                </h2>
                <p className="mt-1 text-xs text-white/60">
                  Talk to the AI about how you feel.
                </p>
              </div>
              <div className="modal-scroll mt-4 max-h-[200px] overflow-y-auto space-y-2">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      msg.role === "user"
                        ? "feelvie-button ml-auto max-w-[85%] rounded-2xl px-4 py-2.5 text-sm text-white"
                        : "feelvie-card-muted rounded-2xl px-4 py-3 text-xs leading-[170%] text-white/70"
                    }
                  >
                    {msg.content}
                  </div>
                ))}
                {chatLoading && (
                  <div className="feelvie-card-muted rounded-2xl px-4 py-3 text-xs text-white/50">
                    Typing…
                  </div>
                )}
              </div>
              {chatError && (
                <p className="mt-2 text-xs font-medium text-red-400">{chatError}</p>
              )}
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => { e.preventDefault(); sendChatMessage(chatInput); }}
              >
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type how you feel..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-red-400/50 focus:ring-1 focus:ring-red-400/30"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="feelvie-button rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(178,34,34,0.5)] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  Send
                </button>
              </form>
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-white">Previous picks</h3>
                {!user ? (
                  <p className="mt-2 text-xs text-white/50">
                    Sign in to save your recommendations.
                  </p>
                ) : history.length === 0 ? (
                  <p className="mt-2 text-xs text-white/50">
                    Your recommendations will appear here.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {history.slice(0, 5).map((item, index) => (
                      <li
                        key={`${item.imdbID}-${index}`}
                        className="feelvie-card-muted rounded-xl px-3 py-2 transition hover:bg-white/10 cursor-pointer"
                      >
                        <span className="text-sm font-medium text-white">{item.Title}</span>
                        <span className="text-xs text-white/50"> · {item.Year} · {item.imdbRating}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          )}
        </section>

        {/* Other Related Movies */}
        {(movie || relatedList.length > 0) && (
          <section className="feelvie-card mx-auto mt-14 w-full max-w-[1216px] p-6 md:p-8">
            <h2 className="feelvie-title text-2xl font-semibold tracking-tight text-white md:text-[32px] md:leading-[39px]">
              Other related movies
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {relatedList.map((m) => (
                <MoviePosterCard
                  key={m.imdbID}
                  movie={m}
                  onClick={() => setSelectedMovie(m)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Movie Modal for related movies */}
        <ClientPortal>
          <MovieModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            watchlistPlaylists={watchlistPlaylists}
            watchedPlaylists={watchedPlaylists}
            getPlaylistsContaining={getPlaylistsContaining}
            isMovieInPlaylist={isMovieInPlaylist}
            addMovieToPlaylist={addMovieToPlaylist}
            removeMovieFromPlaylist={removeMovieFromPlaylist}
            createPlaylist={createPlaylist}
            renamePlaylist={renamePlaylist}
            deletePlaylist={deletePlaylist}
            isInWatchList={selectedMovie ? isInWatchList(selectedMovie.imdbID) : false}
            isWatched={selectedMovie ? isWatched(selectedMovie.imdbID) : false}
            onToggleWatchlist={() => {
              if (selectedMovie) {
                if (isInWatchList(selectedMovie.imdbID)) {
                  removeFromWatchList(selectedMovie.imdbID);
                } else {
                  addToWatchList(selectedMovie);
                }
              }
            }}
            onToggleWatched={() => {
              if (selectedMovie) {
                markWatched(selectedMovie);
              }
            }}
            user={user}
            onSignIn={() => router.push("/signin")}
          />
        </ClientPortal>
      </div>
    </div>
  );
}
