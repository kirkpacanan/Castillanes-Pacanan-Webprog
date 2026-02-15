"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import PosterPlaceholder from "../components/PosterPlaceholder";

const suggestions = [
  "I want a mind-bending sci-fi that feels emotional.",
  "Give me a cozy feel-good movie about friendship.",
  "Something dark and suspenseful with twists.",
  "An inspiring true story that feels hopeful."
];

export default function HomePage() {
  const { user, signIn, signOut, hydrated } = useAuth();
  const {
    watchList,
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
    return [analysis.genre, analysis.mood, ...(analysis.themes || [])].filter(Boolean);
  }, [analysis]);

  const posterUrls = useMemo(() => {
    const posters = [
      ...backgroundPosters,
      ...[movie, ...history].map((item) => item?.Poster)
    ].filter((p) => p && p !== "N/A");
    const unique = [...new Set(posters)];
    if (unique.length < 4) return [];
    return [...unique, ...unique, ...unique].slice(0, 18);
  }, [movie, history, backgroundPosters]);

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

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 pb-24 pt-10 md:px-8 md:pt-14 animate-fade-in">
        {/* Logo and hero */}
        <section className="text-center">
          <h1 className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white md:text-3xl" style={{ fontFamily: "Inter, sans-serif" }}>
            Feelvie
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-lg leading-relaxed text-slate-700 dark:text-white/95 md:text-xl md:leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
            Tell us how you feel… and we&apos;ll tell you what to watch.
          </p>
        </section>

        {/* Search bar + year */}
        <section className="mx-auto mt-10 w-full max-w-[904px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex h-[92px] items-center gap-3 rounded-[50px] bg-slate-200/90 dark:bg-[#1E1E1E]/95 px-6 shadow-lg ring-1 ring-slate-300/50 dark:ring-white/5 transition focus-within:ring-2 focus-within:ring-[#8E1B1B]/50">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type a sentence or phrase."
                className="min-w-0 flex-1 bg-transparent text-xl text-slate-900 placeholder:text-slate-500 dark:text-white dark:placeholder:text-white/60 outline-none md:text-2xl"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#8E1B1B] text-white transition hover:bg-[#a02020] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                aria-label="Search"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </button>
            </div>
            <div className="relative w-full max-w-[904px]">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="h-[42px] w-full appearance-none rounded-[50px] bg-slate-200/90 dark:bg-[#1E1E1E]/95 pl-6 pr-10 text-lg text-slate-900 dark:text-white ring-1 ring-slate-300/50 dark:ring-white/5 outline-none transition focus:ring-2 focus:ring-[#8E1B1B]/50"
                style={{ fontFamily: "Inter, sans-serif" }}
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
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => { setPrompt(item); requestRecommendation(item); }}
                className="rounded-full border border-slate-300 dark:border-white/20 bg-slate-200/60 dark:bg-white/5 px-4 py-2 text-sm text-slate-800 dark:text-white/90 transition hover:border-[#8E1B1B]/60 hover:bg-slate-300/80 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Main: Result Section (left) + Mood Chat (right) */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[696px_1fr] lg:gap-8 xl:grid-cols-[minmax(0,696px)_minmax(0,504px)]">
          {/* Result Section */}
          <div className="min-h-[608px] rounded-2xl border border-slate-200 dark:border-white/5 bg-white/90 dark:bg-[#0a0505]/95 p-6 shadow-xl backdrop-blur-sm md:p-8">
            <h2 className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white md:text-[32px] md:leading-[39px]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
              Recommended Movie
            </h2>
            {!movie && (
              <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
                <div className="aspect-[2/3] w-full max-w-[380px] flex-shrink-0 overflow-hidden rounded-[8px] bg-transparent">
                  <PosterPlaceholder className="h-full w-full rounded-[8px]" />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <p className="text-slate-600 dark:text-[#838383] text-[11px] leading-[14px] md:text-sm" style={{ fontFamily: "Inder, sans-serif" }}>
                    Submit a prompt or pick a suggestion above to get a personalized movie recommendation.
                  </p>
                </div>
              </div>
            )}
            {movie && (
              <div className="mt-6 flex flex-col gap-6 md:flex-row">
                <div className="aspect-[2/3] w-full max-w-[380px] flex-shrink-0 overflow-hidden rounded-[8px] bg-transparent">
                  {movie.Poster && movie.Poster !== "N/A" ? (
                    <img
                      src={movie.Poster}
                      alt={`${movie.Title} poster`}
                      className="h-full w-full rounded-[8px] object-contain"
                    />
                  ) : (
                    <PosterPlaceholder className="h-full w-full rounded-[8px]" />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="font-['Inria_Sans'] text-lg leading-[22px] text-red-600 dark:text-[#DD7575]" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
                    {movie.Genre}
                  </p>
                  <h3 className="font-['Inclusive_Sans'] text-2xl leading-[29px] text-slate-900 dark:text-white" style={{ fontFamily: "'Inclusive Sans', sans-serif" }}>
                    {movie.Title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-[20px] border border-slate-400 dark:border-[#838383] px-2 py-0.5 font-['Inder'] text-xs leading-[15px] text-slate-600 dark:text-[#838383]" style={{ fontFamily: "Inder, sans-serif" }}>{movie.Year}</span>
                    <span className="rounded-[20px] border border-slate-400 dark:border-[#838383] px-2 py-0.5 font-['Inder'] text-xs leading-[15px] text-slate-600 dark:text-[#838383]">⭐ {movie.imdbRating}</span>
                    <span className="font-['Inder'] text-xs leading-[15px] text-slate-600 dark:text-[#838383]">{movie.Runtime}</span>
                  </div>
                  <p className="mt-2 font-['Inder'] text-[11px] leading-[14px] text-slate-600 dark:text-[#838383] line-clamp-2" style={{ fontFamily: "Inder, sans-serif" }}>
                    {movie.Plot}
                  </p>
                  {keywordChips.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {keywordChips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-[20px] bg-red-100 px-2 py-0.5 font-['Inclusive_Sans'] text-[9px] leading-[11px] text-red-700 dark:bg-[rgba(142,27,27,0.5)] dark:text-[#FF8C8C]"
                          style={{ fontFamily: "'Inclusive Sans', sans-serif" }}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                  {user && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          isInWatchList(movie.imdbID)
                            ? removeFromWatchList(movie.imdbID)
                            : addToWatchList(movie)
                        }
                        className="rounded-xl bg-[#8E1B1B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#a02020] hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isInWatchList(movie.imdbID) ? "Remove from Watch list" : "Add to Watch list"}
                      </button>
                      <button
                        type="button"
                        onClick={() => markWatched(movie)}
                        className="rounded-xl bg-[#8E1B1B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#a02020] hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Watched
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mood Chat */}
          {showMoodChat && (
            <aside className="min-h-[608px] rounded-2xl border border-slate-200 dark:border-white/5 bg-white/90 dark:bg-[#0a0505]/95 p-6 shadow-xl backdrop-blur-sm md:p-8">
              <div className="rounded-xl border border-red-200 dark:border-[#8E1B1B]/50 bg-red-50/80 dark:bg-[rgba(178,34,34,0.15)] px-4 py-3">
                <h2 className="text-xl font-medium text-slate-900 dark:text-white" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
                  Mood Chat
                </h2>
                <p className="mt-1 text-xs text-slate-600 dark:text-white/60" style={{ fontFamily: "Inder, sans-serif" }}>
                  Talk to the AI about how you feel.
                </p>
              </div>
              <div className="mt-4 max-h-[200px] overflow-y-auto space-y-2">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      msg.role === "user"
                        ? "ml-auto max-w-[85%] rounded-2xl bg-[#8E1B1B]/90 px-4 py-2.5 text-sm text-white"
                        : "rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 px-4 py-3 text-xs leading-relaxed text-slate-700 dark:text-white/70"
                    }
                    style={msg.role === "assistant" ? { fontFamily: "Inder, sans-serif" } : undefined}
                  >
                    {msg.content}
                  </div>
                ))}
                {chatLoading && (
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 px-4 py-3 text-xs text-slate-500 dark:text-white/50" style={{ fontFamily: "Inder, sans-serif" }}>
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
                  className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 outline-none transition focus:border-[#8E1B1B]/50 focus:ring-1 focus:ring-[#8E1B1B]/30"
                  style={{ fontFamily: "Inder, sans-serif" }}
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="rounded-xl bg-[#8E1B1B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#a02020] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                >
                  Send
                </button>
              </form>
              <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white">Previous Picks</h3>
                {!user ? (
                  <p className="mt-2 text-xs text-slate-500 dark:text-white/50" style={{ fontFamily: "Inder, sans-serif" }}>
                    Sign in to save your recommendations.
                  </p>
                ) : history.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500 dark:text-white/50" style={{ fontFamily: "Inder, sans-serif" }}>
                    Your recommendations will appear here.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {history.slice(0, 5).map((item) => (
                      <li
                        key={item.imdbID}
                        className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 px-3 py-2 transition hover:bg-slate-200/80 dark:hover:bg-white/10"
                      >
                        <span className="text-sm font-medium text-slate-900 dark:text-white" style={{ fontFamily: "'Inclusive Sans', sans-serif" }}>{item.Title}</span>
                        <span className="text-xs text-slate-500 dark:text-white/50"> · {item.Year} · {item.imdbRating}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          )}
        </section>

        {/* Other Related Movies */}
        {(movie || history.length > 0) && (
          <section className="mx-auto mt-14 w-full max-w-[1216px] rounded-2xl border border-slate-200 dark:border-white/5 bg-white/90 dark:bg-[#0a0505]/95 p-6 shadow-xl backdrop-blur-sm md:p-8">
            <h2 className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white md:text-[32px] md:leading-[39px]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
              Other Related Movies
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[...(movie ? [movie] : []), ...history.filter((m) => !movie || m.imdbID !== movie.imdbID)]
                .slice(0, 15)
                .map((m) => (
                  <div key={m.imdbID} className="group flex flex-col">
                    <Link
                      href="#"
                      onClick={(e) => { e.preventDefault(); setMovie(m); setAnalysis(null); }}
                      className="block overflow-hidden rounded-lg shadow-lg transition duration-200 hover:scale-[1.03] hover:shadow-xl"
                    >
                      <div className="flex aspect-[2/3] w-full items-center justify-center bg-slate-100 dark:bg-white/5">
                        {m.Poster && m.Poster !== "N/A" ? (
                          <img
                            src={m.Poster}
                            alt=""
                            className="h-full w-full object-contain rounded-lg"
                          />
                        ) : (
                          <PosterPlaceholder className="h-full w-full rounded-lg" />
                        )}
                      </div>
                    </Link>
                    <p className="mt-3 text-center text-sm font-medium text-slate-800 dark:text-white/95 line-clamp-2 group-hover:text-slate-900 dark:group-hover:text-white" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
                      {m.Title}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
