/**
 * Test Gemini API key. Run from project root:
 *   node scripts/check-gemini-key.js
 * Loads GEMINI_API_KEY from .env.local if present, or use:
 *   GEMINI_API_KEY=yourkey node scripts/check-gemini-key.js
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
const key = process.env.GEMINI_API_KEY;

if (!key) {
  console.error("No GEMINI_API_KEY found. Set it in .env.local or run:");
  console.error("  GEMINI_API_KEY=yourkey node scripts/check-gemini-key.js");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;

async function check() {
  console.log("Calling Gemini (gemini-2.5-flash)...");
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Say hello in one word." }] }],
        generationConfig: { maxOutputTokens: 64 }
      })
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Response (not JSON):", text.slice(0, 500));
      return;
    }
    if (!res.ok) {
      console.error("API error:", res.status, data?.error?.message || text);
      if (data?.error?.code) console.error("Code:", data.error.code);
      if (res.status === 403 || res.status === 401) {
        console.error("→ Check your API key at https://aistudio.google.com/app/apikey");
      }
      return;
    }
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (reply) {
      console.log("OK – Gemini responded:", reply.trim());
    } else {
      console.error("No text in response:", JSON.stringify(data, null, 2).slice(0, 800));
    }
  } catch (e) {
    console.error("Request failed:", e.message);
    if (e.cause) console.error("Cause:", e.cause);
  }
}

check();
