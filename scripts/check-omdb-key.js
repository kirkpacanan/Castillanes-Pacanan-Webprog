/**
 * Quick check for OMDb API key: run with
 *   node scripts/check-omdb-key.js
 * Uses OMDB_API_KEY from .env.local (load it yourself) or pass as env:
 *   OMDB_API_KEY=yourkey node scripts/check-omdb-key.js
 */
const key = process.env.OMDB_API_KEY || "2e033ec7";
const url = `https://www.omdbapi.com/?apikey=${key}&t=Paddington%202&plot=short`;

async function check() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.Response === "True") {
      console.log("OK – API key works. Example:", data.Title, data.Year);
    } else {
      console.log("API returned:", data.Response, "Error:", data.Error || "(none)");
      if (data.Error && (data.Error.includes("limit") || data.Error.includes("Request"))) {
        console.log("→ Your key is over its limit or rate-limited. Get a new key at https://www.omdbapi.com/apikey.aspx");
      }
      if (data.Error && data.Error.includes("Invalid")) {
        console.log("→ The API key is invalid. Check OMDB_API_KEY in .env.local");
      }
    }
  } catch (e) {
    console.error("Request failed:", e.message);
  }
}

check();
