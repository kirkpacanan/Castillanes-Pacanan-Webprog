"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import PosterPlaceholder from "../components/PosterPlaceholder";
import MovieModal from "../components/MovieModal";
import MoviePosterCard from "../components/MoviePosterCard";
import PlaylistPicker from "../components/PlaylistPicker";
import ClientPortal from "../components/ClientPortal";
import { useMoodGlow } from "../context/MoodGlowContext";

const suggestions = [
  "I want a mind-bending fantasy that feels magical.",        // Purple (mystical)
  "Give me a cozy heartwarming movie about friendship.",      // Orange (warm)
  "Something dark and suspenseful with twists.",              // Black (dark)
  "An inspiring story that feels hopeful and uplifting.",     // Yellow (joyful)
  "A passionate romantic drama with intense emotions.",       // Red (passionate)
  "A healing journey set in nature with beautiful landscapes.", // Green (natural)
  "A simple and minimalist film with pure storytelling.",     // White (pure)
  "A calm and peaceful film with a serene atmosphere."        // Blue (calm)
];

/** Mood → RGB for ambient glow. Each color represents one unique mood category. */
const MOOD_GLOW_COLORS = {
  blue: [59, 130, 246],     // CALM: Trust, peace, serenity
  red: [220, 38, 38],       // PASSION: Love, intensity, danger
  yellow: [234, 179, 8],    // JOY: Happiness, optimism, hope
  green: [34, 197, 94],     // NATURE: Balance, growth, harmony
  black: [38, 38, 48],      // DARK: Sadness, tension, mystery
  white: [200, 210, 230],   // PURITY: Simplicity, clarity, innocence
  purple: [147, 51, 234],   // MYSTICAL: Fantasy, imagination, wonder
  orange: [249, 115, 22],   // WARM: Coziness, comedy, friendliness
};

/** 
 * Mood keyword mapping - each mood has exclusive keywords to prevent conflicts.
 * Keywords are ordered by specificity (most specific first) for better matching.
 */
const MOOD_KEYWORDS = [
  // MYSTICAL (Purple) - Fantasy, imagination, supernatural - checked first for specificity
  { 
    color: "purple", 
    mood: "mystical",
    words: [
      "mind-bending", "fantasy", "magical", "magic", "mystic", "mystical",
      "supernatural", "surreal", "dreamlike", "imaginative", "imagination",
      "wonderland", "enchanted", "wizard", "witch", "spell", "cosmic"
    ]
  },
  
  // DARK (Black) - Sadness, tension, noir, gothic
  { 
    color: "black", 
    mood: "dark",
    words: [
      "dark", "noir", "gothic", "gritty", "bleak", "somber", "melancholic",
      "sad", "sadness", "grief", "mourning", "despair", "grim", "brooding",
      "tense", "tension", "thriller", "suspense", "suspenseful", "sinister"
    ]
  },
  
  // NATURE (Green) - Natural world, balance, growth, healing - moved up for better access
  { 
    color: "green", 
    mood: "natural",
    words: [
      "nature", "natural", "outdoors", "wilderness", "forest", "jungle",
      "garden", "countryside", "rural", "scenic", "landscape", "mountain",
      "ocean", "sea", "beach", "river", "lake", "island",
      "healing", "therapeutic", "rejuvenating", "renewal", "restorative",
      "survival", "expedition", "trek", "camping", "hiking",
      "animals", "wildlife", "environmental", "eco", "sustainable",
      "balance", "balanced", "harmony", "harmonious", "zen", "grounded",
      "growth", "fresh", "organic", "earth", "green", "lush"
    ]
  },
  
  // PASSION (Red) - Love, intensity, danger, energy
  { 
    color: "red", 
    mood: "passionate",
    words: [
      "passionate", "passion", "intense", "intensity", "love", "romantic", "romance",
      "steamy", "desire", "lust", "fiery", "fierce", "powerful", "dramatic",
      "danger", "dangerous", "urgent", "adrenaline", "action-packed"
    ]
  },
  
  // JOY (Yellow) - Happiness, optimism, hope, inspiration
  { 
    color: "yellow", 
    mood: "joyful",
    words: [
      "happy", "happiness", "joyful", "joy", "cheerful", "optimistic", "optimism",
      "hopeful", "hope", "inspiring", "inspirational", "uplifting", "uplift",
      "positive", "bright", "sunny", "delightful", "gleeful", "jubilant"
    ]
  },
  
  // WARM (Orange) - Coziness, comedy, friendliness, comfort
  { 
    color: "orange", 
    mood: "warm",
    words: [
      "cozy", "warm", "warmth", "heartwarming", "comforting", "comfort",
      "friendly", "welcoming", "wholesome", "charming",
      "funny", "comedy", "comedic", "humorous", "hilarious", "laugh",
      "fun", "playful", "lighthearted", "entertaining"
    ]
  },
  
  // CALM (Blue) - Peace, tranquility, trust, security
  { 
    color: "blue", 
    mood: "calm",
    words: [
      "calm", "calming", "peaceful", "peace", "tranquil", "tranquility",
      "serene", "serenity", "relaxing", "relax", "mellow", "quiet",
      "trust", "trustworthy", "safe", "safety", "security", "secure", "stable",
      "soothing", "gentle", "meditative", "contemplative", "still", "soft"
    ]
  },
  
  // PURITY (White) - Simplicity, clarity, minimalism, innocence
  { 
    color: "white", 
    mood: "pure",
    words: [
      "pure", "purity", "innocent", "innocence", "pristine",
      "clean", "clarity", "clear", "simple", "simplicity",
      "minimal", "minimalist", "minimalism", "understated"
    ]
  },
];

/**
 * Determines mood color based on keyword analysis with improved conflict resolution.
 * Uses weighted scoring to handle multiple keyword matches.
 */
function getMoodGlowColor(analysis, lastPrompt) {
  const text = [lastPrompt, analysis?.mood, analysis?.genre, ...(analysis?.themes || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  
  if (!text) return MOOD_GLOW_COLORS.red;
  
  // Score each mood based on keyword matches
  const moodScores = {};
  
  for (const { color, mood, words } of MOOD_KEYWORDS) {
    const matches = words.filter(keyword => {
      // Use word boundary matching to avoid partial matches
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(text);
    });
    
    if (matches.length > 0) {
      // Weight by number of matches and keyword specificity
      moodScores[color] = (moodScores[color] || 0) + matches.length;
    }
  }
  
  // Return the mood with highest score, or default to red
  if (Object.keys(moodScores).length > 0) {
    const topMood = Object.entries(moodScores).sort((a, b) => b[1] - a[1])[0][0];
    return MOOD_GLOW_COLORS[topMood];
  }
  
  return MOOD_GLOW_COLORS.red;
}

/** Start loading poster images in the background so they appear faster when the UI updates. */
function preloadPosterUrls(urls) {
  if (!urls?.length) return;
  urls.forEach((url) => {
    if (!url || url === "N/A") return;
    const img = new Image();
    img.src = url;
  });
}

/** RGB [0-255] to hue in degrees for CSS hue-rotate. */
function rgbToHue(r, g, b) {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B);
  const delta = max - min;
  if (delta === 0) return 0;
  let h = 0;
  if (max === R) h = ((G - B) / delta) % 6;
  else if (max === G) h = (B - R) / delta + 2;
  else h = (R - G) / delta + 4;
  h = (h * 60 + 360) % 360;
  return Math.round(h);
}

/** CSS filter to tint the mood chat B&W PNG by mood color. */
function getMoodChatIconFilter(moodR, moodG, moodB, moodRgb) {
  const hue = rgbToHue(moodR, moodG, moodB);
  const max = Math.max(moodR, moodG, moodB) / 255;
  const min = Math.min(moodR, moodG, moodB) / 255;
  const saturation = max === 0 ? 0 : (max - min) / max;
  if (saturation < 0.3) {
    return max > 0.6
      ? `grayscale(1) brightness(2) contrast(1.05) drop-shadow(0 0 8px rgba(${moodRgb}, 0.5))`
      : `grayscale(1) brightness(0.5) contrast(1.2) drop-shadow(0 0 6px rgba(${moodRgb}, 0.5))`;
  }
  if (hue >= 40 && hue <= 60) return `hue-rotate(${hue + 5}deg) saturate(2) brightness(1.2) drop-shadow(0 0 8px rgba(${moodRgb}, 0.5))`;
  if (hue >= 15 && hue <= 39) return `hue-rotate(${hue + 3}deg) saturate(1.9) brightness(1.15) drop-shadow(0 0 8px rgba(${moodRgb}, 0.5))`;
  return `hue-rotate(${hue}deg) saturate(1.3) brightness(1.05) drop-shadow(0 0 8px rgba(${moodRgb}, 0.5))`;
}

export default function HomeClient({ initialPosters = [] }) {
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
  const [backgroundPosters, setBackgroundPosters] = useState(Array.isArray(initialPosters) ? initialPosters : []);
  const [cursorGlow, setCursorGlow] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [moodChatPopupState, setMoodChatPopupState] = useState("hidden"); // "hidden" | "visible" | "leaving"
  const [logoAnimationKey, setLogoAnimationKey] = useState(0);
  const [logoIntroPlaying, setLogoIntroPlaying] = useState(false);
  const chatScrollRef = useRef(null);
  const moodChatPopupTimersRef = useRef({ show: null, hide: null, leave: null });
  const posterPoolRef = useRef([]);
  const chatOpenRef = useRef(chatOpen);
  const { moodGlowColor, setMoodGlowColor } = useMoodGlow();
  chatOpenRef.current = chatOpen;

  useEffect(() => {
    if (!chatOpen) return;
    const el = chatScrollRef.current;
    if (!el) return;
    const scrollToBottom = () => {
      el.scrollTop = el.scrollHeight;
    };
    scrollToBottom();
    const t = requestAnimationFrame(scrollToBottom);
    return () => cancelAnimationFrame(t);
  }, [chatOpen, chatMessages, chatLoading]);

  const handleMouseMove = (e) => {
    setCursorGlow({ x: e.clientX, y: e.clientY });
    setCursorVisible(true);
  };
  const handleMouseLeave = () => setCursorVisible(false);

  useEffect(() => {
    if (backgroundPosters.length === 0) return;
    const pool = posterPoolRef.current;
    const seen = new Set(pool);
    for (const url of backgroundPosters) {
      if (url && url !== "N/A" && !seen.has(url)) {
        seen.add(url);
        pool.push(url);
      }
    }
  }, [backgroundPosters]);

  useEffect(() => {
    const t = setTimeout(() => setLogoIntroPlaying(false), 1500);
    return () => clearTimeout(t);
  }, [logoAnimationKey]);

  /* Mood Chat popup: show "I'm Feelvie's Mood Chat" once in a while, then animate out */
  useEffect(() => {
    const timers = moodChatPopupTimersRef.current;
    let isFirst = true;
    function scheduleNext() {
      const delay = isFirst ? 6000 : 14000;
      isFirst = false;
      timers.show = setTimeout(() => {
        if (chatOpenRef.current) {
          scheduleNext();
          return;
        }
        setMoodChatPopupState("visible");
        timers.hide = setTimeout(() => {
          setMoodChatPopupState("leaving");
          timers.leave = setTimeout(() => {
            setMoodChatPopupState("hidden");
            scheduleNext();
          }, 350);
        }, 4000);
      }, delay);
    }
    scheduleNext();
    return () => {
      if (timers.show) clearTimeout(timers.show);
      if (timers.hide) clearTimeout(timers.hide);
      if (timers.leave) clearTimeout(timers.leave);
    };
  }, []);

  useEffect(() => {
    if (Array.isArray(initialPosters) && initialPosters.length > 0) return;
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
  }, [initialPosters]);

  const keywordChips = useMemo(() => {
    if (!analysis) return [];
    const chips = [analysis.genre, analysis.mood, ...(analysis.themes || [])].filter(Boolean);
    return [...new Set(chips)];
  }, [analysis]);

  const posterUrls = useMemo(() => {
    const base = [
      ...backgroundPosters,
      ...[movie, ...history, ...relatedMovies].map((item) => item?.Poster)
    ].filter((p) => p && p !== "N/A");
    const uniqueBase = [...new Set(base)];
    const minPosters = 12;
    if (uniqueBase.length >= minPosters) return uniqueBase;
    const pool = posterPoolRef.current;
    const seen = new Set(uniqueBase);
    const fill = [];
    for (const url of pool) {
      if (fill.length + uniqueBase.length >= minPosters) break;
      if (url && url !== "N/A" && !seen.has(url)) {
        seen.add(url);
        fill.push(url);
      }
    }
    return [...uniqueBase, ...fill];
  }, [movie, history, relatedMovies, backgroundPosters]);

  const relatedList = useMemo(() => {
    const base = relatedMovies?.length ? relatedMovies : history;
    return base
      .filter((item) => item && (!movie || item.imdbID !== movie.imdbID))
      .slice(0, 25);
  }, [relatedMovies, history, movie]);

  /** Split posters into 3 groups (different per row). Repeat each row’s set exactly 2x so the CSS -50% loop is seamless (no glitch on reset). */
  const MIN_ITEMS_PER_COPY = 12;
  const { posterRow1Items, posterRow2Items, posterRow3Items } = useMemo(() => {
    const empty = Array(24).fill(null);
    if (posterUrls.length < 3) return { posterRow1Items: empty, posterRow2Items: empty, posterRow3Items: empty };
    const n = posterUrls.length;
    const c1 = Math.max(1, Math.ceil(n / 3));
    const c2 = Math.max(1, Math.ceil((n - c1) / 2));
    const row1 = posterUrls.slice(0, c1);
    const row2 = posterUrls.slice(c1, c1 + c2);
    const row3 = posterUrls.slice(c1 + c2, n);
    const repeatForTrack = (arr) => {
      if (!arr.length) return empty;
      const repeat = Math.ceil(MIN_ITEMS_PER_COPY / arr.length);
      const oneCopy = Array(repeat).fill(arr).flat().slice(0, MIN_ITEMS_PER_COPY);
      return [...oneCopy, ...oneCopy];
    };
    return {
      posterRow1Items: repeatForTrack(row1),
      posterRow2Items: repeatForTrack(row2),
      posterRow3Items: repeatForTrack(row3)
    };
  }, [posterUrls]);

  const fetchRecommendation = async (promptText, yearOverride = year, options = {}) => {
    const { quick = false } = options;
    const response = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: promptText,
        year: yearOverride || null,
        excludeIds: history.map((item) => item.imdbID),
        watchlistIds: watchList.map((item) => item.imdbID),
        watchedIds: watched.map((item) => item.imdbID),
        quick
      })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "We could not find a match.");
    return payload;
  };

  const applyRecommendation = (payload, promptText) => {
    const posterUrlsFromPayload = [
      payload.movie?.Poster,
      ...(payload.relatedMovies || []).map((m) => m?.Poster)
    ].filter((p) => p && p !== "N/A");
    preloadPosterUrls(posterUrlsFromPayload);
    const pool = posterPoolRef.current;
    const seen = new Set(pool);
    for (const url of posterUrlsFromPayload) {
      if (!seen.has(url)) {
        seen.add(url);
        pool.push(url);
      }
    }
    if (pool.length > 48) posterPoolRef.current = pool.slice(-48);
    setMovie(payload.movie);
    setAnalysis(payload.analysis);
    setRelatedMovies(payload.relatedMovies || []);
    setHistory((prev) => [payload.movie, ...prev].slice(0, 5));
    setLastPrompt(promptText);
    setMoodGlowColor(getMoodGlowColor(payload.analysis, promptText));
    setLogoAnimationKey((prev) => prev + 1);
    setLogoIntroPlaying(true);
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
          const rec = await fetchRecommendation(payload.prompt, payload.year || detectedYear || year, { quick: true });
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

  const moodR = moodGlowColor[0];
  const moodG = moodGlowColor[1];
  const moodB = moodGlowColor[2];
  const moodRgb = `${moodR}, ${moodG}, ${moodB}`;

  return (
    <div
      className="page-home relative min-h-screen overflow-hidden bg-slate-100 dark:bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ["--mood-r"]: moodR,
        ["--mood-g"]: moodG,
        ["--mood-b"]: moodB,
      }}
    >
      {/* Mood-based ambient glow – color shifts with search (default red, smooth transition) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden page-home-mood-glow-wrapper"
        style={{
          "--mood-r": moodGlowColor[0],
          "--mood-g": moodGlowColor[1],
          "--mood-b": moodGlowColor[2],
        }}
      >
        <div className="page-home-red-glow page-home-red-glow-1" aria-hidden />
        <div className="page-home-red-glow page-home-red-glow-2" aria-hidden />
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
      {/* Floating poster rows – show images immediately when we have URLs (no loading state) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="poster-row poster-row-1">
          <div className="poster-track">
            {posterRow1Items.map((url, i) => (
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
        <div className="poster-row poster-row-2">
          <div className="poster-track reverse">
            {posterRow2Items.map((url, i) => (
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
        <div className="poster-row poster-row-3">
          <div className="poster-track">
            {posterRow3Items.map((url, i) => (
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
        {/* Logo and hero – text-only logo with mood-based outer glow */}
        <section className="text-center">
          <div
            className="logo-mood-glow mx-auto inline-block max-w-[220px] sm:max-w-[260px] md:max-w-[320px]"
            style={{
              ["--mood-r"]: moodGlowColor[0],
              ["--mood-g"]: moodGlowColor[1],
              ["--mood-b"]: moodGlowColor[2],
            }}
          >
            <div
              key={logoAnimationKey}
              className={`feelvie-logo-text text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight${loading ? " feelvie-logo-text--looping" : ""}${movie && !loading && !logoIntroPlaying ? " feelvie-logo-text--stopped" : ""}`}
              aria-label="Feelvie"
              data-text="feelvie"
            >
              {"feelvie".split("").map((ch, index) => (
                <span key={index} className="feelvie-logo-letter" data-char={ch}>
                  {ch}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base leading-[170%] text-white/85 md:text-lg px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Tell us how you feel, and we&apos;ll match you with films that resonate.
          </p>
        </section>

        {/* Search bar + year */}
        <section className="mx-auto mt-6 sm:mt-10 w-full max-w-[904px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
            <div
              className={`search-bar-border-wrap relative rounded-[26px] p-[2px] transition-all duration-300 ${loading ? "search-bar-border-wrap--loading" : ""}`}
              style={{
                ["--mood-r"]: moodGlowColor[0],
                ["--mood-g"]: moodGlowColor[1],
                ["--mood-b"]: moodGlowColor[2],
              }}
            >
              <div
                className="feelvie-card flex h-[70px] sm:h-[92px] items-center gap-2 sm:gap-3 px-4 sm:px-6 rounded-[24px] transition focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-[rgba(9,9,12,0.9)]"
                style={{ ["--tw-ring-color"]: `rgba(${moodRgb}, 0.5)` }}
              >
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type a sentence or phrase."
                className="min-w-0 flex-1 bg-transparent text-base sm:text-xl md:text-2xl font-medium text-white placeholder:font-normal placeholder:text-white/50 outline-none"
                style={{ fontFamily: "'Inter', sans-serif" }}
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
            </div>
            <div className="relative w-full max-w-[904px]">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="year-select h-12 w-full appearance-none rounded-2xl border border-white/15 bg-white/[0.06] pl-5 pr-12 text-sm font-medium text-white outline-none transition-all duration-200 hover:border-white/25 hover:bg-white/[0.08] focus:bg-white/[0.08] focus:ring-2 [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                style={{ ["--tw-ring-color"]: `rgba(${moodRgb}, 0.4)`, fontFamily: "'Inter', sans-serif" }}
              >
                <option value="">Any year</option>
                {Array.from({ length: 50 }, (_, i) => (
                  <option key={i} value={`${new Date().getFullYear() - i}`}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/60">
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                onClick={() => {
                setPrompt(item);
                setError("");
                setMoodGlowColor(getMoodGlowColor({}, item));
                requestRecommendation(item);
              }}
                className="feelvie-chip px-4 py-2 text-xs font-medium text-white transition-all duration-300 ease-out hover:scale-105 active:scale-95"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Mood Chat – PNG is the clickable; no circle, larger */}
        {!chatOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
          {/* Popup: "I'm Feelvie's Mood Chat" – shows once in a while with animation */}
          {(moodChatPopupState === "visible" || moodChatPopupState === "leaving") && (
            <div
              className={`mood-chat-popup px-3 py-2 rounded-xl text-sm font-medium text-white whitespace-nowrap shadow-lg pointer-events-none ${
                moodChatPopupState === "leaving" ? "mood-chat-popup-leave" : "mood-chat-popup-enter"
              }`}
              style={{
                background: `linear-gradient(135deg, rgba(${moodRgb}, 0.95) 0%, rgba(${moodRgb}, 0.85) 100%)`,
                border: `1px solid rgba(${moodRgb}, 0.6)`,
                boxShadow: `0 4px 20px rgba(${moodRgb}, 0.4)`,
              }}
              aria-live="polite"
            >
              I&apos;m Feelvie&apos;s Mood Chat
            </div>
          )}
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="mood-chat-icon block p-0 border-0 bg-transparent cursor-pointer transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
            style={{ ["--tw-ring-color"]: `rgba(${moodR}, ${moodG}, ${moodB}, 0.6)` }}
            aria-label="Open Mood Chat"
          >
            <img
              src="/mood-chat-icon.png"
              alt=""
              className="h-24 w-24 sm:h-28 sm:w-28 object-contain pointer-events-none select-none transition-[filter] duration-700 ease-out"
              style={{ filter: getMoodChatIconFilter(moodR, moodG, moodB, moodRgb) }}
              aria-hidden
            />
          </button>
        </div>
        )}

        {/* Result Section – show whenever a movie was found (visible when chat is closed; when chat is open, chat panel is on the right so this stays visible on the left) */}
        {movie && (
        <section className="mt-8 sm:mt-12">
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
                {/* Poster Container - Centered on mobile, left-aligned on desktop */}
                <div className="shrink-0 flex items-start justify-center px-4 py-4 md:justify-start md:px-6 md:py-0">
                  <div className="w-40 max-h-60 sm:w-44 sm:max-h-[264px] md:w-48 md:max-h-72 aspect-[2/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-800 md:translate-x-2">
                    {movie.Poster && movie.Poster !== "N/A" ? (
                      <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <PosterPlaceholder className="h-full w-full" />
                    )}
                  </div>
                </div>

                {/* Right: Scrollable Details */}
                <div className="modal-scroll flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 pr-4 md:px-2 md:pb-6 md:pr-6">
                  <div className="flex flex-col gap-3 pb-4 sm:pb-6 md:pb-8">
                    <p className="mood-accent-text text-xs font-semibold uppercase tracking-wider">
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
                            className="mood-accent-chip rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ease-out hover:scale-110 cursor-default"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Guest: Sign in prompt */}
                    {!user && (
                      <div className="mood-accent-box mt-4 rounded-2xl border p-4 transition-all duration-300">
                        <p className="text-sm text-white/90">
                          Want to save this movie to your Watchlist or mark it as Watched? Sign in to start tracking your movies!
                        </p>
                        <button
                          type="button"
                          onClick={() => router.push("/signin")}
                          className="mood-accent-button mt-3 w-full rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:scale-105 hover:brightness-110 active:scale-95"
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
                                  ? "mood-accent-chip border border-current"
                                  : "mood-accent-border border border-white/20 text-white/80 hover:text-white"
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
                                  ? "mood-accent-chip border border-current"
                                  : "mood-accent-border border border-white/20 text-white/80 hover:text-white"
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
        </section>
        )}

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

        {/* Floating Mood Chat – compact card bottom-right */}
        {chatOpen && (
          <ClientPortal>
            <div
              className="mood-chat-backdrop fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6"
              aria-modal="true"
              role="dialog"
              aria-label="Mood Chat"
            >
              <div
                className="absolute inset-0 bg-black/40 mood-chat-overlay"
                onClick={() => setChatOpen(false)}
                aria-hidden="true"
              />
              <div
                className="mood-chat-panel feelvie-card relative z-10 flex w-full max-w-md flex-col rounded-2xl p-4 shadow-2xl sm:p-5"
                style={{
                  maxHeight: "min(70vh, 560px)",
                  background: "linear-gradient(145deg, rgba(20, 20, 25, 0.98), rgba(15, 15, 18, 0.98))",
                  border: `1px solid rgba(${moodRgb}, 0.25)`,
                  boxShadow: `0 0 40px rgba(${moodRgb}, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.5)`,
                  ["--mood-r"]: moodR,
                  ["--mood-g"]: moodG,
                  ["--mood-b"]: moodB,
                }}
              >
                <div
                  className="rounded-xl px-3 py-2.5 mb-3 flex-shrink-0"
                  style={{
                    background: `rgba(${moodRgb}, 0.15)`,
                    border: `1px solid rgba(${moodRgb}, 0.3)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>Mood Chat</h2>
                      <p className="mt-0.5 text-xs text-white/60">Talk to the AI about how you feel.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setChatOpen(false)}
                      className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                      aria-label="Close Mood Chat"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div
                  ref={chatScrollRef}
                  className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-2 pr-1"
                  style={{ maxHeight: "320px" }}
                >
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
                  className="mt-4 flex gap-2 flex-shrink-0"
                  onSubmit={(e) => { e.preventDefault(); sendChatMessage(chatInput); }}
                >
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type how you feel..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:ring-1"
                    style={{ ["--tw-ring-color"]: `rgba(${moodRgb}, 0.5)` }}
                  />
                  <button
                    type="submit"
                    disabled={chatLoading}
                    className="feelvie-button rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    Send
                  </button>
                </form>
                <div className="mt-6 flex-shrink-0">
                  <h3 className="text-sm font-semibold text-white">Previous picks</h3>
                  {!user ? (
                    <p className="mt-2 text-xs text-white/50">Sign in to save your recommendations.</p>
                  ) : history.length === 0 ? (
                    <p className="mt-2 text-xs text-white/50">Your recommendations will appear here.</p>
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
              </div>
            </div>
          </ClientPortal>
        )}

        {/* Movie Modal for related movies */}
        <ClientPortal>
          <MovieModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            moodGlowColor={moodGlowColor}
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
