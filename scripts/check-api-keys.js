/**
 * Test OMDB and TMDB API keys. Run from project root:
 *   node scripts/check-api-keys.js
 * Loads keys from .env.local automatically. Or pass env vars:
 *   OMDB_API_KEY=xxx TMDB_API_KEY=yyy node scripts/check-api-keys.js
 */

const fs = require("fs");
const path = require("path");

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}

loadEnvLocal();

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function checkOmdb() {
  if (!OMDB_API_KEY) {
    console.log("OMDB: (skip) No OMDB_API_KEY in .env.local");
    return;
  }
  try {
    const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=Paddington%202&plot=short`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.Response === "True") {
      console.log("OMDB: OK – key works. Example:", data.Title, data.Year);
    } else {
      console.log("OMDB: Failed –", data.Error || data.Response || "unknown");
      if (data.Error?.toLowerCase().includes("invalid")) {
        console.log("       → Check OMDB_API_KEY at https://www.omdbapi.com/apikey.aspx");
      }
      if (data.Error?.toLowerCase().includes("limit")) {
        console.log("       → Daily limit reached. Try again later or use a new key.");
      }
    }
  } catch (e) {
    console.log("OMDB: Request failed –", e.message);
  }
}

async function checkTmdb() {
  if (!TMDB_API_KEY) {
    console.log("TMDB: (skip) No TMDB_API_KEY in .env.local");
    return;
  }
  try {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=Paddington%202&page=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (res.ok && Array.isArray(data.results) && data.results.length > 0) {
      const first = data.results[0];
      console.log("TMDB: OK – key works. Example:", first.title, first.release_date?.slice(0, 4) || "");
    } else if (data.status_code === 7) {
      console.log("TMDB: Failed – Invalid API key.");
      console.log("       → Get a key at https://www.themoviedb.org/settings/api");
    } else if (data.status_message) {
      console.log("TMDB: Failed –", data.status_message);
    } else {
      console.log("TMDB: Unexpected response –", res.status, JSON.stringify(data).slice(0, 80));
    }
  } catch (e) {
    console.log("TMDB: Request failed –", e.message);
  }
}

async function main() {
  console.log("Checking API keys (using .env.local if present)...\n");
  await checkOmdb();
  await checkTmdb();
  console.log("\nDone. If both show OK, recommendations will use OMDB + TMDB for wider selection.");
}

main();
