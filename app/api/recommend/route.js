const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY || "2e033ec7";
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "about",
  "like",
  "want",
  "watch",
  "movie",
  "something",
  "feel",
  "looking",
  "into",
  "from",
  "have",
  "would",
  "really",
  "kind"
]);

const GENRES = [
  "action",
  "adventure",
  "animation",
  "comedy",
  "crime",
  "documentary",
  "drama",
  "family",
  "fantasy",
  "history",
  "horror",
  "music",
  "mystery",
  "romance",
  "sci-fi",
  "science fiction",
  "thriller",
  "war",
  "western"
];

const MOODS = [
  "dark",
  "funny",
  "emotional",
  "inspiring",
  "mind-bending",
  "romantic",
  "suspenseful",
  "hopeful",
  "gritty",
  "heartwarming",
  "uplifting",
  "tense"
];

const NEGATIVE_MOOD_TERMS = [
  "sad",
  "heartbreak",
  "heartbroken",
  "breakup",
  "break up",
  "grief",
  "lonely",
  "down"
];

const POSITIVE_MOOD_TERMS = [
  "funny",
  "comedy",
  "light",
  "uplift",
  "uplifting",
  "feel-good",
  "feelgood",
  "happy"
];

const FALLBACK_LIBRARY = {
  "sci-fi": ["Interstellar", "Arrival", "Blade Runner 2049", "Ex Machina"],
  emotional: [
    "Eternal Sunshine of the Spotless Mind",
    "Interstellar",
    "Her"
  ],
  funny: ["Game Night", "Palm Springs", "The Nice Guys", "Booksmart"],
  comedy: ["Game Night", "The Nice Guys", "Spy", "The Grand Budapest Hotel"],
  uplift: ["The Secret Life of Walter Mitty", "Chef", "Paddington 2"],
  lift: ["The Secret Life of Walter Mitty", "Chef", "Paddington 2"],
  uplifting: ["The Secret Life of Walter Mitty", "Chef", "Paddington 2"],
  "feel-good": ["Chef", "Paddington 2", "The Secret Life of Walter Mitty"],
  feelgood: ["Chef", "Paddington 2", "The Secret Life of Walter Mitty"],
  happy: ["The Secret Life of Walter Mitty", "About Time", "Sing Street"],
  sad: ["Eternal Sunshine of the Spotless Mind", "Her", "The Fault in Our Stars"],
  romance: ["About Time", "The Notebook", "La La Land"],
  teen: ["The Fault in Our Stars", "To All the Boys I've Loved Before", "Love, Simon"],
  light: ["Chef", "Julie & Julia", "The Grand Budapest Hotel"],
  friendship: ["Paddington 2", "The Intouchables", "Toy Story"],
  cozy: ["Paddington 2", "Chef", "Julie & Julia"],
  dark: ["Gone Girl", "Prisoners", "Zodiac"],
  suspenseful: ["Shutter Island", "Se7en", "The Prestige"],
  twist: ["The Prestige", "The Sixth Sense", "Fight Club"],
  inspiring: ["The Pursuit of Happyness", "Hidden Figures", "The Blind Side"],
  hopeful: ["The Pursuit of Happyness", "The Martian", "The Blind Side"],
  "true story": ["The Imitation Game", "Spotlight", "A Beautiful Mind"]
};

const COUNTRY_LIBRARY = {
  filipino: ["Heneral Luna", "Maria", "On the Job", "The Hows of Us"],
  philippines: ["Heneral Luna", "Maria", "On the Job", "The Hows of Us"],
  korean: ["Parasite", "Train to Busan", "Minari", "Burning"],
  japan: ["Spirited Away", "Your Name", "Seven Samurai", "Shoplifters"],
  japanese: ["Spirited Away", "Your Name", "Seven Samurai", "Shoplifters"],
  india: ["3 Idiots", "Dangal", "PK", "Lagaan"],
  indian: ["3 Idiots", "Dangal", "PK", "Lagaan"],
  chinese: ["Hero", "Crouching Tiger, Hidden Dragon", "Farewell My Concubine"],
  france: ["Amélie", "The Intouchables", "Portrait of a Lady on Fire"],
  french: ["Amélie", "The Intouchables", "Portrait of a Lady on Fire"],
  spanish: ["Pan's Labyrinth", "The Invisible Guest", "The Orphanage"],
  mexico: ["Roma", "Y Tu Mamá También", "Amores Perros"],
  british: ["1917", "Pride", "About Time", "The King's Speech"],
  uk: ["1917", "Pride", "About Time", "The King's Speech"]
};

const normalize = (value) => value.toLowerCase();

const extractKeywordsFallback = (prompt) => {
  const lower = normalize(prompt);
  const genre =
    GENRES.find((item) => lower.includes(item)) ||
    GENRES.find((item) => lower.includes(item.replace("-", " ")));
  const mood =
    MOODS.find((item) => lower.includes(item)) ||
    MOODS.find((item) => lower.includes(item.replace("-", " ")));

  const wordThemes = lower
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 4 && !STOPWORDS.has(word))
    .slice(0, 4);

  const fallbackTags = Object.keys(FALLBACK_LIBRARY).filter(
    (key) => lower.includes(key) || lower.includes(key.replace("-", " "))
  );
  const themes = [...new Set([...wordThemes, ...fallbackTags])].slice(0, 8);

  return {
    genre,
    mood,
    themes,
    keywords: [genre, mood, ...themes].filter(Boolean)
  };
};

const extractSearchTerms = (prompt) => {
  return normalize(prompt)
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOPWORDS.has(word))
    .slice(0, 4);
};

const detectMoodBias = (prompt) => {
  const lower = normalize(prompt);
  if (NEGATIVE_MOOD_TERMS.some((term) => lower.includes(term))) {
    return "sad";
  }
  if (POSITIVE_MOOD_TERMS.some((term) => lower.includes(term))) {
    return "uplift";
  }
  return null;
};

const extractCountryTags = (prompt) => {
  const lower = normalize(prompt);
  return Object.keys(COUNTRY_LIBRARY).filter((key) => lower.includes(key));
};

/** Mood → OMDb search terms (theme/genre, not literal titles like "Sad Movie"). */
const MOOD_TO_OMDB_SEARCH = {
  sad: "drama emotional grief loss",
  dark: "drama thriller mystery",
  funny: "comedy",
  emotional: "drama emotional",
  inspiring: "drama inspiring true story",
  "mind-bending": "sci-fi thriller",
  romantic: "romance drama",
  suspenseful: "thriller suspense",
  hopeful: "drama inspiring",
  gritty: "drama crime",
  heartwarming: "drama family",
  uplifting: "comedy drama inspiring",
  tense: "thriller drama",
  happy: "comedy feel-good",
  anxious: "drama thriller",
  angry: "drama action",
  tired: "drama quiet",
  neutral: "drama"
};

/** Build OMDb search query from mood/genre/themes so we don't match literal titles (e.g. "Sad Movie"). */
const buildSearchQueryForOmdb = (analysis, prompt) => {
  const genre = analysis?.genre || "";
  const mood = (analysis?.mood || "").toLowerCase();
  const themes = (analysis?.themes || []).slice(0, 3);
  const moodSearch = MOOD_TO_OMDB_SEARCH[mood] || mood || "";
  const parts = [genre, moodSearch, ...themes].filter(Boolean);
  const query = uniqueList(parts.join(" ").split(/\s+/)).slice(0, 5).join(" ");
  if (query) return query;
  const terms = extractSearchTerms(prompt).filter((t) => t.length > 2 && !["sad", "funny", "happy"].includes(t));
  return terms.slice(0, 4).join(" ") || "drama";
};

/** Score 0–100 how well a plot matches the user's mood/themes (synopsis-based selection). */
const scorePlotRelevance = (plot, mood, genre, themes) => {
  if (!plot || plot === "N/A") return 0;
  const text = normalize(plot);
  const moodTerms = (MOOD_TO_OMDB_SEARCH[mood] || mood || "").split(/\s+/).filter(Boolean);
  const themeTerms = [...(themes || []), genre].filter(Boolean);
  let score = 0;
  for (const term of moodTerms) {
    if (term.length > 2 && text.includes(term)) score += 15;
  }
  for (const term of themeTerms) {
    if (term.length > 2 && text.includes(normalize(term))) score += 10;
  }
  return Math.min(100, score);
};

/** Avoid picking a film whose title is just the mood phrase (e.g. "Sad Movie", "Funny Movie"). */
const isTitleMoodPhrase = (title, prompt) => {
  if (!title || !prompt) return false;
  const t = normalize(title);
  const p = normalize(prompt);
  const moodWords = ["sad", "funny", "happy", "scary", "romantic", "angry", "tired"];
  for (const w of moodWords) {
    if (p.includes(w) && (t === `${w} movie` || t === `${w} film` || t.startsWith(`${w} movie`) || t.startsWith(`${w} film`)))
      return true;
  }
  return false;
};

const parseJson = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const RECOMMEND_SYSTEM_PROMPT = `You are a movie expert. Your answers are used to search the OMDb database—suggest only movies that exist there so we can find them.

Rules:
- Return ONLY real movies that are in IMDb/OMDb. Use the exact official English title (e.g. "The Shawshank Redemption", "Spirited Away", "Paddington 2").
- For "title", pick ONE film that best matches the mood. Include "year" (4-digit) when you know it.
- Fill "genre", "mood", and "themes" from the user's request so we can search OMDb reliably.
- In "related", list up to 10 other real movies that fit the same vibe (exact titles, no placeholders).
- Never invent titles. Prefer well-known, widely released films so OMDb lookup succeeds.

Example for "cozy feel-good about friendship":
{"title":"Paddington 2","year":"2017","genre":"comedy","mood":"heartwarming","themes":["friendship","family","feel-good"],"keywords":["cozy","friendship","feel-good"],"related":["Chef","The Secret Life of Walter Mitty","The Intouchables","Toy Story"]}

Respond ONLY with valid JSON: {"title":"", "year":"", "genre":"", "mood":"", "themes":[], "keywords":[], "related":[]}`;

const callOpenAI = async (prompt) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: RECOMMEND_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error("OpenAI request failed");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI returned no content");
  }
  const parsed = parseJson(content);
  if (!parsed) {
    throw new Error("OpenAI returned invalid JSON");
  }
  return parsed;
};

const GEMINI_RECOMMEND_MODELS = ["gemini-2.5-flash", "gemini-flash-latest"];

const callGeminiWithModel = async (model, prompt) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: RECOMMEND_SYSTEM_PROMPT }]
        },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          response_mime_type: "application/json"
        }
      })
    }
  );

  const bodyText = await response.text();
  let data;
  try {
    data = bodyText ? JSON.parse(bodyText) : {};
  } catch (e) {
    throw new Error("Gemini returned invalid response");
  }

  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini request failed");
  }

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!content) {
    throw new Error("Gemini returned no content");
  }
  const parsed = parseJson(content);
  if (!parsed) {
    throw new Error("Gemini returned invalid JSON");
  }
  return parsed;
};

const callGemini = async (prompt) => {
  let lastError;
  for (const model of GEMINI_RECOMMEND_MODELS) {
    try {
      return await callGeminiWithModel(model, prompt);
    } catch (err) {
      lastError = err;
      if (err?.message?.includes("404")) continue;
      throw err;
    }
  }
  throw lastError || new Error("Gemini request failed");
};

const buildQuery = (analysis, prompt, year) => {
  const keywords = analysis?.keywords?.length ? analysis.keywords : [];
  if (keywords.length) {
    return keywords.slice(0, 5).join(" ");
  }
  const terms = extractSearchTerms(prompt);
  const trimmed = terms.length ? terms.join(" ") : prompt.trim().slice(0, 60);
  return year ? `${trimmed} ${year}` : trimmed;
};

const uniqueList = (items) => [...new Set(items.filter(Boolean))];

const extractRelatedTitles = (analysis) => {
  const raw =
    analysis?.related || analysis?.relatedTitles || analysis?.recommendations || [];
  return Array.isArray(raw) ? raw : [];
};

const pickFallbackTitles = (prompt, analysis) => {
  const moodBias = detectMoodBias(prompt);
  const countryTags = extractCountryTags(prompt);
  const promptLower = normalize(prompt);
  const phraseTags = Object.keys(FALLBACK_LIBRARY).filter(
    (key) => promptLower.includes(key) || promptLower.includes(key.replace(/-/g, " "))
  );
  const tags = uniqueList([
    analysis?.genre,
    analysis?.mood,
    ...(analysis?.themes || []),
    ...promptLower.split(/\s+/),
    ...phraseTags
  ]);

  const candidates = [];
  countryTags.forEach((tag) => {
    candidates.push(...(COUNTRY_LIBRARY[tag] || []));
  });

  if (moodBias === "sad") {
    candidates.push(...FALLBACK_LIBRARY.sad, ...FALLBACK_LIBRARY.emotional);
  }
  if (moodBias === "uplift") {
    candidates.push(
      ...FALLBACK_LIBRARY.uplifting,
      ...FALLBACK_LIBRARY["feel-good"]
    );
  }

  tags.forEach((tag) => {
    const normalized = normalize(tag);
    if (FALLBACK_LIBRARY[normalized]) {
      candidates.push(...FALLBACK_LIBRARY[normalized]);
    }
    if (normalized.includes("feel") && normalized.includes("good")) {
      candidates.push(...FALLBACK_LIBRARY["feel-good"]);
    }
    if (normalized.startsWith("uplift") || normalized.startsWith("lift")) {
      candidates.push(...FALLBACK_LIBRARY.uplifting);
    }
    if (normalized.includes("funny") || normalized.includes("comedy")) {
      candidates.push(...FALLBACK_LIBRARY.comedy);
    }
    if (normalized.includes("happy")) {
      candidates.push(...FALLBACK_LIBRARY.happy);
    }
    if (normalized.includes("sad")) {
      candidates.push(...FALLBACK_LIBRARY.sad);
    }
    if (normalized.includes("teen")) {
      candidates.push(...FALLBACK_LIBRARY.teen);
    }
    if (normalized.includes("romance") || normalized.includes("love")) {
      candidates.push(...FALLBACK_LIBRARY.romance);
    }
    if (normalized === "sci-fi" || normalized === "science fiction") {
      candidates.push(...FALLBACK_LIBRARY["sci-fi"]);
    }
    if (normalized.includes("friend")) {
      candidates.push(...FALLBACK_LIBRARY.friendship);
    }
    if (normalized.includes("twist")) {
      candidates.push(...FALLBACK_LIBRARY.twist);
    }
  });

  return uniqueList(candidates).slice(0, 6);
};

const searchOmdb = async (query, excludeIds, year) => {
  const searchUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(
    query
  )}&type=movie${year ? `&y=${encodeURIComponent(year)}` : ""}`;
  const response = await fetch(searchUrl);
  const data = await response.json();
  if (data.Response === "False") {
    return null;
  }
  const results = (data.Search || []).filter(
    (item) => !excludeIds.includes(item.imdbID)
  );
  return results[0] || null;
};

const searchOmdbMany = async (query, excludeIds, year, limit = 10) => {
  const searchUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(
    query
  )}&type=movie${year ? `&y=${encodeURIComponent(year)}` : ""}`;
  const response = await fetch(searchUrl);
  const data = await response.json();
  if (data.Response === "False") {
    return [];
  }
  const results = (data.Search || []).filter(
    (item) => !excludeIds.includes(item.imdbID)
  );
  return results.slice(0, limit);
};

const fetchByTitle = async (title, year) => {
  const titleUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
    title
  )}${year ? `&y=${encodeURIComponent(year)}` : ""}&plot=short`;
  const response = await fetch(titleUrl);
  return response.json();
};

const fetchMovieDetails = async (imdbID) => {
  const detailsUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=short`;
  const response = await fetch(detailsUrl);
  return response.json();
};

// ---------- TMDB (wider selection): optional, used alongside OMDB ----------
/** TMDB genre name -> id (for discover/movie). search/movie is title-only, so we use discover for mood/genre. */
const GENRE_TO_TMDB_ID = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "sci-fi": 878,
  "science fiction": 878,
  thriller: 53,
  war: 10752,
  western: 37
};

/** Discover movies by genre (and optional year). Use this when we have mood/genre, not a title. */
const discoverTmdb = async (genreIds, year, page = 1) => {
  if (!TMDB_API_KEY || !genreIds?.length) return [];
  const ids = [...new Set(genreIds)].slice(0, 3).join(",");
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    with_genres: ids,
    page: String(page),
    include_adult: "false",
    sort_by: "popularity.desc"
  });
  if (year) params.set("primary_release_year", String(year));
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params.toString()}`
  );
  const data = await response.json();
  if (!response.ok || !Array.isArray(data.results)) return [];
  return data.results.filter((m) => !m.adult && m.poster_path);
};

/** Get TMDB genre IDs from analysis (genre + mood mapped to genre). */
const getTmdbGenreIds = (analysis) => {
  const ids = [];
  const g = (analysis?.genre || "").toLowerCase().trim();
  if (g && GENRE_TO_TMDB_ID[g]) ids.push(GENRE_TO_TMDB_ID[g]);
  const mood = (analysis?.mood || "").toLowerCase().trim();
  const moodToGenre = {
    sad: 18,
    dark: 53,
    funny: 35,
    emotional: 18,
    inspiring: 18,
    "mind-bending": 878,
    romantic: 10749,
    suspenseful: 53,
    hopeful: 18,
    gritty: 80,
    heartwarming: 10751,
    uplifting: 35,
    tense: 53,
    happy: 35
  };
  if (mood && moodToGenre[mood] && !ids.includes(moodToGenre[mood]))
    ids.push(moodToGenre[mood]);
  return ids.length ? ids : [18];
}

/** Search by title (use for specific movie names only). */
const searchTmdb = async (query, year, page = 1) => {
  if (!TMDB_API_KEY || !query?.trim()) return [];
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query: query.trim(),
    page: String(page),
    include_adult: "false"
  });
  if (year) params.set("primary_release_year", String(year));
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?${params.toString()}`
  );
  const data = await response.json();
  if (!response.ok || !Array.isArray(data.results)) return [];
  return data.results.filter((m) => !m.adult && m.poster_path);
};

const fetchTmdbDetails = async (tmdbId) => {
  if (!TMDB_API_KEY) return null;
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`;
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.json();
};

/** Normalize TMDB movie to OMDB-like shape so the app and watchlist work the same. Use imdb_id when present so we dedupe with OMDB. */
const normalizeTmdbToOmdbShape = (tmdbMovie) => {
  const year = tmdbMovie.release_date
    ? tmdbMovie.release_date.slice(0, 4)
    : tmdbMovie.Year || "";
  const genreNames = (tmdbMovie.genres || [])
    .map((g) => g.name)
    .filter(Boolean);
  const Genre = genreNames.length ? genreNames.join(", ") : "Movie";
  const imdbID = tmdbMovie.imdb_id || `tmdb_${tmdbMovie.id}`;
  const Poster =
    tmdbMovie.poster_path && tmdbMovie.poster_path !== "N/A"
      ? `${TMDB_IMAGE_BASE}${tmdbMovie.poster_path}`
      : "N/A";
  const Runtime =
    tmdbMovie.runtime != null ? `${tmdbMovie.runtime} min` : undefined;
  return {
    Title: tmdbMovie.title || tmdbMovie.original_title || "",
    Year: year,
    Plot: tmdbMovie.overview || "N/A",
    Poster,
    imdbRating:
      tmdbMovie.vote_average != null ? String(tmdbMovie.vote_average) : "N/A",
    imdbID,
    Genre,
    Runtime,
    Response: "True",
    Source: "tmdb"
  };
};

/** Fetch TMDB details and return one OMDB-shaped movie, or null. */
const fetchTmdbMovieAsOmdbShape = async (tmdbId) => {
  const details = await fetchTmdbDetails(tmdbId);
  if (!details || details.adult) return null;
  return normalizeTmdbToOmdbShape(details);
};

/** Ensure poster URL is HTTPS so images load on deployed HTTPS (e.g. Vercel). */
const posterHttps = (url) => {
  if (!url || url === "N/A" || typeof url !== "string") return url;
  return url.replace(/^http:\/\//i, "https://");
};

/** Dedupe key: same movie from both APIs (prefer OMDB entry when both have imdbID). */
const movieDedupeKey = (m) => m.imdbID || `${m.Title}_${m.Year}`;

/** Merge OMDB results with TMDB results; exclude ids in excludeIds; return OMDB-shaped list, no duplicates. */
const mergeOmdbAndTmdbCandidates = async (
  omdbDetailsList,
  tmdbSearchResults,
  excludeIds
) => {
  const seen = new Set(excludeIds || []);
  const byKey = new Map();

  for (const m of omdbDetailsList || []) {
    if (!m || m.Response === "False") continue;
    const id = m.imdbID;
    if (seen.has(id)) continue;
    seen.add(id);
    byKey.set(movieDedupeKey(m), m);
  }

  if (!TMDB_API_KEY || !tmdbSearchResults?.length) {
    return Array.from(byKey.values());
  }

  const tmdbIds = tmdbSearchResults
    .slice(0, 15)
    .map((r) => r.id)
    .filter(Boolean);
  const tmdbDetailsList = await Promise.all(
    tmdbIds.map((id) => fetchTmdbDetails(id))
  );

  for (const d of tmdbDetailsList) {
    if (!d || d.adult) continue;
    const normalized = normalizeTmdbToOmdbShape(d);
    const id = normalized.imdbID;
    if (seen.has(id)) continue;
    const key = movieDedupeKey(normalized);
    if (byKey.has(key)) continue;
    seen.add(id);
    byKey.set(key, normalized);
  }

  return Array.from(byKey.values());
};

export async function POST(request) {
  if (!OMDB_API_KEY) {
    return Response.json(
      { message: "Missing OMDb API key. Set OMDB_API_KEY." },
      { status: 500 }
    );
  }

  const { prompt, year, excludeIds = [], watchlistIds = [], watchedIds = [], quick = false } = await request.json();
  if (!prompt || !prompt.trim()) {
    return Response.json(
      { message: "Please provide a short movie description." },
      { status: 400 }
    );
  }

  // Quick path (e.g. from Mood Chat): search OMDB + TMDB discover by genre, merge and dedupe, rank by plot/synopsis.
  if (quick) {
    const quickAnalysis = extractKeywordsFallback(prompt);
    const safeQuery = buildSearchQueryForOmdb(quickAnalysis, prompt);
    const tmdbGenreIds = getTmdbGenreIds(quickAnalysis);

    const [omdbSearchResults, tmdbSearchResults] = await Promise.all([
      searchOmdbMany(safeQuery, excludeIds, year, 25),
      TMDB_API_KEY ? discoverTmdb(tmdbGenreIds, year) : Promise.resolve([])
    ]);

    const omdbDetails =
      omdbSearchResults.length > 0
        ? await Promise.all(
            omdbSearchResults.map((r) => fetchMovieDetails(r.imdbID))
          )
        : [];
    const validOmdb = omdbDetails.filter((m) => m?.Response !== "False");

    const merged = await mergeOmdbAndTmdbCandidates(
      validOmdb,
      tmdbSearchResults,
      excludeIds
    );

    if (!merged.length) {
      const fallbackTitles = pickFallbackTitles(prompt, quickAnalysis);
      for (const title of fallbackTitles) {
        const t = await fetchByTitle(title, year);
        if (t?.Response !== "False" && !excludeIds.includes(t?.imdbID)) {
          const relatedFromSearch = await searchOmdbMany(t.Genre?.split(",")[0] || "drama", [t.imdbID], year, 19);
          const relatedDetails = await Promise.all(
            relatedFromSearch.slice(0, 19).map((r) => fetchMovieDetails(r.imdbID))
          );
          const relatedMovies = relatedDetails.filter((m) => m?.Response !== "False");
          return Response.json({
            movie: t,
            relatedMovies,
            meta: { yearRelaxed: false },
            analysis: { title: t.Title, year: t.Year, genre: quickAnalysis?.genre, mood: quickAnalysis?.mood, themes: quickAnalysis?.themes || [], keywords: quickAnalysis?.keywords || [], related: [] }
          });
        }
      }
      return Response.json(
        { message: "No matching movie found. Try a different mood or phrase." },
        { status: 404 }
      );
    }

    const mood = (quickAnalysis?.mood || "").toLowerCase();
    const genre = quickAnalysis?.genre || "";
    const themes = quickAnalysis?.themes || [];
    const scored = merged.map((m) => {
      let score = scorePlotRelevance(m.Plot, mood, genre, themes);
      // Boost watchlist movies by 50%
      if (watchlistIds.includes(m.imdbID)) {
        score *= 1.5;
      }
      // Penalize watched movies by 30%
      if (watchedIds.includes(m.imdbID)) {
        score *= 0.7;
      }
      return { movie: m, score };
    });
    scored.sort((a, b) => (b.score - a.score));
    const sorted = scored.map((s) => s.movie);
    const mainDetails = sorted[0];
    const relatedMovies = sorted.slice(1, 21);
    return Response.json({
      movie: mainDetails,
      relatedMovies,
      meta: { yearRelaxed: false },
      analysis: {
        title: mainDetails?.Title,
        year: mainDetails?.Year,
        genre: quickAnalysis?.genre,
        mood: quickAnalysis?.mood,
        themes: quickAnalysis?.themes || [],
        keywords: quickAnalysis?.keywords || [],
        related: []
      }
    });
  }

  let analysis = null;
  try {
    if (GEMINI_API_KEY) {
      analysis = await callGemini(prompt);
    } else if (OPENAI_API_KEY) {
      analysis = await callOpenAI(prompt);
    } else {
      analysis = extractKeywordsFallback(prompt);
    }
  } catch (error) {
    analysis = extractKeywordsFallback(prompt);
  }

  let movie = null;
  let yearRelaxed = false;
  const skipTitle = analysis?.title && isTitleMoodPhrase(analysis.title, prompt);
  if (analysis?.title && !skipTitle) {
    const preferredYear = year || analysis.year;
    const titleResult = await fetchByTitle(analysis.title, preferredYear);
    if (titleResult?.Response !== "False") {
      if (!excludeIds.includes(titleResult.imdbID)) {
        movie = titleResult;
      }
    }
    if (!movie && preferredYear) {
      const retryTitle = await fetchByTitle(analysis.title);
      if (retryTitle?.Response !== "False") {
        if (!excludeIds.includes(retryTitle.imdbID)) {
          movie = retryTitle;
          yearRelaxed = true;
        }
      }
    }
  }

  if (!movie) {
    const fallbackTitles = pickFallbackTitles(prompt, analysis);
    for (const title of fallbackTitles) {
      let titleResult = await fetchByTitle(title, year);
      if (titleResult?.Response !== "False") {
        if (!excludeIds.includes(titleResult.imdbID)) {
          movie = titleResult;
          break;
        }
      }
      if (!movie && year) {
        titleResult = await fetchByTitle(title);
        if (titleResult?.Response !== "False" && !excludeIds.includes(titleResult?.imdbID)) {
          movie = titleResult;
          yearRelaxed = true;
          break;
        }
      }
      if (!movie) {
        const searchMatch = await searchOmdb(title, excludeIds, year);
        if (searchMatch?.imdbID) {
          const details = await fetchMovieDetails(searchMatch.imdbID);
          if (details?.Response !== "False" && !excludeIds.includes(details?.imdbID)) {
            movie = details;
            break;
          }
        }
        if (!movie && year) {
          const searchMatchNoYear = await searchOmdb(title, excludeIds);
          if (searchMatchNoYear?.imdbID) {
            const details = await fetchMovieDetails(searchMatchNoYear.imdbID);
            if (details?.Response !== "False" && !excludeIds.includes(details?.imdbID)) {
              movie = details;
              yearRelaxed = true;
              break;
            }
          }
        }
      }
    }
  }

  if (!movie) {
    const query = buildSearchQueryForOmdb(analysis, prompt);
    const fallbackQuery = buildQuery(analysis, prompt, year);
    const tmdbGenreIds = getTmdbGenreIds(analysis);
    const hasRealTitle = analysis?.title && !skipTitle && analysis.title.length > 2;

    // OMDB search (may be over limit) + TMDB discover by genre (always works when we have genre)
    const [matchOmdb1, matchOmdb2, tmdbByGenre, tmdbByTitle] = await Promise.all([
      searchOmdb(query, excludeIds, year),
      searchOmdb(fallbackQuery, excludeIds, year),
      TMDB_API_KEY ? discoverTmdb(tmdbGenreIds, year) : Promise.resolve([]),
      TMDB_API_KEY && hasRealTitle ? searchTmdb(analysis.title, year) : Promise.resolve([])
    ]);

    let match = matchOmdb1 || matchOmdb2;
    if (!match && year) {
      const [relaxed1, relaxed2] = await Promise.all([
        searchOmdb(query, excludeIds),
        searchOmdb(buildQuery(analysis, prompt, null), excludeIds)
      ]);
      match = relaxed1 || relaxed2;
      if (match) yearRelaxed = true;
    }

    if (match) {
      movie = await fetchMovieDetails(match.imdbID);
    }

    if (!movie && TMDB_API_KEY) {
      const tmdbResults = [
        ...(tmdbByTitle || []),
        ...(tmdbByGenre || [])
      ].filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);
      for (const tmdbItem of tmdbResults.slice(0, 10)) {
        const normalized = await fetchTmdbMovieAsOmdbShape(tmdbItem.id);
        if (normalized && !excludeIds.includes(normalized.imdbID)) {
          movie = normalized;
          break;
        }
      }
      if (!movie && prompt.trim()) {
        const promptQuery = prompt.trim().split(/\s+/).slice(0, 4).join(" ");
        if (promptQuery && promptQuery.length > 1) {
          const byPrompt = await searchTmdb(promptQuery, year);
          for (const tmdbItem of byPrompt.slice(0, 5)) {
            const normalized = await fetchTmdbMovieAsOmdbShape(tmdbItem.id);
            if (normalized && !excludeIds.includes(normalized.imdbID)) {
              movie = normalized;
              break;
            }
          }
        }
      }
    }
  }

  if (!movie) {
    return Response.json(
      { message: "No matching movie found. Try a new prompt." },
      { status: 404 }
    );
  }

  const RELATED_CAP = 20;
  const relatedTitles = uniqueList([
    ...extractRelatedTitles(analysis),
    ...pickFallbackTitles(prompt, analysis)
  ])
    .filter((title) => title && title !== analysis?.title)
    .slice(0, RELATED_CAP);

  const seenIds = new Set([...(excludeIds || []), movie?.imdbID].filter(Boolean));

  const addRelated = (candidate, relatedMovies) => {
    if (!candidate || candidate.Response === "False") return false;
    if (seenIds.has(candidate.imdbID)) return false;
    relatedMovies.push(candidate);
    seenIds.add(candidate.imdbID);
    return true;
  };

  // Fetch related by title in parallel (batches of 5)
  const BATCH = 5;
  let relatedMovies = [];
  for (let i = 0; i < relatedTitles.length; i += BATCH) {
    const batch = relatedTitles.slice(i, i + BATCH);
    const preferredYear = year || analysis?.year;
    const results = await Promise.all(
      batch.map((title) =>
        fetchByTitle(title, preferredYear).then((r) =>
          r?.Response === "False" && preferredYear ? fetchByTitle(title) : r
        )
      )
    );
    for (const titleResult of results) {
      if (relatedMovies.length >= RELATED_CAP) break;
      addRelated(titleResult, relatedMovies);
    }
  }

  if (relatedMovies.length < RELATED_CAP) {
    const query = buildQuery(analysis, prompt, year);
    const searchResults = await searchOmdbMany(query, [...seenIds], year, RELATED_CAP - relatedMovies.length);
    const detailsList = await Promise.all(searchResults.map((r) => fetchMovieDetails(r.imdbID)));
    for (const details of detailsList) {
      if (relatedMovies.length >= RELATED_CAP) break;
      addRelated(details, relatedMovies);
    }
    if (relatedMovies.length < RELATED_CAP && year) {
      const relaxedResults = await searchOmdbMany(query, [...seenIds], null, RELATED_CAP - relatedMovies.length);
      const relaxedDetails = await Promise.all(relaxedResults.map((r) => fetchMovieDetails(r.imdbID)));
      for (const details of relaxedDetails) {
        if (relatedMovies.length >= RELATED_CAP) break;
        addRelated(details, relatedMovies);
      }
    }
    if (relatedMovies.length < RELATED_CAP && TMDB_API_KEY) {
      const need = RELATED_CAP - relatedMovies.length;
      const tmdbGenreIds = getTmdbGenreIds(analysis);
      const tmdbResults = await discoverTmdb(tmdbGenreIds, year);
      for (const r of tmdbResults.slice(0, need + 5)) {
        if (relatedMovies.length >= RELATED_CAP) break;
        const normalized = await fetchTmdbMovieAsOmdbShape(r.id);
        if (normalized) addRelated(normalized, relatedMovies);
      }
    }
  }

  const outMovie = movie
    ? { ...movie, Poster: posterHttps(movie.Poster) || movie.Poster }
    : null;
  
  // Score and reorder related movies based on watchlist/watched status
  const scoredRelated = (relatedMovies || []).map((m) => {
    let score = 0;
    if (watchlistIds.includes(m.imdbID)) {
      score += 10; // Boost watchlist movies
    }
    if (watchedIds.includes(m.imdbID)) {
      score -= 5; // Penalize watched movies
    }
    return { movie: m, score };
  });
  
  // Sort by watchlist/watched score first, then maintain original order for ties
  scoredRelated.sort((a, b) => b.score - a.score);
  
  const outRelated = scoredRelated.map((item) => {
    const m = item.movie;
    return m ? { ...m, Poster: posterHttps(m.Poster) || m.Poster } : m;
  });

  return Response.json({
    movie: outMovie,
    relatedMovies: outRelated,
    meta: {
      yearRelaxed
    },
    analysis: {
      title: analysis?.title || null,
      year: analysis?.year || null,
      genre: analysis?.genre || null,
      mood: analysis?.mood || null,
      themes: analysis?.themes || [],
      keywords: analysis?.keywords || [],
      related: extractRelatedTitles(analysis)
    }
  });
}
