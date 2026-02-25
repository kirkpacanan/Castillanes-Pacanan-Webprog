/**
 * Server-safe poster URL fetcher. Used by the API route and by the home page for initial load.
 */

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

function toHttps(url) {
  if (!url || typeof url !== "string") return null;
  return url.replace(/^http:\/\//i, "https://");
}

async function fetchPosterOmdb(title) {
  if (!OMDB_API_KEY) return null;
  const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
  const response = await fetch(url, { next: { revalidate: 3600 } });
  const data = await response.json();
  const poster = data?.Poster && data?.Poster !== "N/A" ? data.Poster : null;
  return poster ? toHttps(poster) : null;
}

async function fetchPostersTmdb(minCount = 6) {
  if (!TMDB_API_KEY) return [];
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&include_adult=false&page=1`;
  const response = await fetch(url, { next: { revalidate: 3600 } });
  const data = await response.json();
  if (!response.ok || !Array.isArray(data.results)) return [];
  return data.results
    .filter((m) => m.poster_path && !m.adult)
    .slice(0, minCount)
    .map((m) => `${TMDB_IMAGE_BASE}${m.poster_path}`);
}

/**
 * Returns an array of poster URLs (HTTPS) for the floating background.
 * Safe to call from Server Components and API routes.
 */
export async function getPosters() {
  const posters = [];

  if (OMDB_API_KEY) {
    const omdbResults = await Promise.all(
      SEED_TITLES.map((title) => fetchPosterOmdb(title))
    );
    for (const poster of omdbResults) {
      if (poster) posters.push(poster);
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

  return posters;
}
