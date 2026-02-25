const OMDB_API_KEY = process.env.OMDB_API_KEY || "2e033ec7";
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const SEED_TITLES = [
  "Inception",
  "Interstellar",
  "The Dark Knight",
  "La La Land",
  "Parasite",
  "Avatar",
  "The Social Network",
  "The Grand Budapest Hotel",
  "Coco",
  "Everything Everywhere All at Once"
];

/** Ensure HTTPS so posters load on deployed HTTPS sites (e.g. Vercel). */
const toHttps = (url) => {
  if (!url || typeof url !== "string") return null;
  return url.replace(/^http:\/\//i, "https://");
};

const fetchPosterOmdb = async (title) => {
  if (!OMDB_API_KEY) return null;
  const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
    title
  )}`;
  const response = await fetch(url);
  const data = await response.json();
  const poster = data?.Poster && data?.Poster !== "N/A" ? data.Poster : null;
  return poster ? toHttps(poster) : null;
};

/** Fetch popular movie posters from TMDB (discover) so we have posters when OMDB is rate-limited. */
const fetchPostersTmdb = async (minCount = 6) => {
  if (!TMDB_API_KEY) return [];
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&include_adult=false&page=1`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || !Array.isArray(data.results)) return [];
  return data.results
    .filter((m) => m.poster_path && !m.adult)
    .slice(0, minCount)
    .map((m) => `${TMDB_IMAGE_BASE}${m.poster_path}`);
};

export async function GET() {
  const posters = [];

  if (OMDB_API_KEY) {
    for (const title of SEED_TITLES) {
      try {
        const poster = await fetchPosterOmdb(title);
        if (poster) posters.push(poster);
      } catch (_) {}
    }
  }

  const need = Math.max(0, 8 - posters.length);
  if (need > 0 && TMDB_API_KEY) {
    try {
      const tmdbPosters = await fetchPostersTmdb(need + 4);
      for (const url of tmdbPosters) {
        if (posters.length >= 12) break;
        if (!posters.includes(url)) posters.push(url);
      }
    } catch (_) {}
  }

  return Response.json({ posters });
}
