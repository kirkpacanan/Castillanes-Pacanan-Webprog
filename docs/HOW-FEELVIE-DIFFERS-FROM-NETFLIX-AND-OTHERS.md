# How Feelvie’s Search Differs From Netflix and Other Movie Engines

---

## Quick comparison

| | **Feelvie** | **Netflix / typical streaming apps** | **IMDb / Google / generic search** |
|--|-------------|--------------------------------------|-------------------------------------|
| **How you search** | Natural language: *how you feel* or *the vibe you want* (e.g. “sad and want something uplifting”, “like Interstellar”) | Genre rows, title search, “Because you watched X”, categories | Title, actor, director, genre keywords |
| **Primary signal** | **Mood / emotion / intent** (plus genre/themes) | **Your watch history + similar titles** and categories | **Exact or keyword match** (title, cast, genre) |
| **Result** | **One focused recommendation** (or a short chat flow) tuned to your current feeling | **Many rows** of suggestions (personalized and non‑personalized) | **List of matches** to your query |
| **Goal** | “What should I watch *right now* given how I feel?” | “What’s available and what might I like based on my behavior?” | “Find a specific movie or filter by criteria.” |

---

## Feelvie: mood-first, language-based

- **Input:** You describe your **mood** or the **vibe** you want in plain language (no need to pick genres or know titles).
- **Processing:** The AI interprets that text (and in chat, whether you want a movie that **matches** or **lifts** your mood), then turns it into a concrete suggestion or into genre/mood/keywords used to pick a movie.
- **Output:** One recommendation at a time, with optional short explanation (e.g. genre/mood chips).
- **Difference:** Built for **“I feel X, what should I watch?”** rather than **“Show me more like Y”** or **“Search by title/genre.”**

So the “search engine” is really a **mood → one movie** pipeline, not a traditional keyword or catalog browser.

---

## Netflix (and similar streaming apps)

- **Input:** You browse rows (genre, “Trending,” “Because you watched X”), use search by **title**, or tap on a title to see similar.
- **Processing:** Recommendations rely heavily on **your watch history, ratings, and similarity between titles** (collaborative filtering, content similarity). Search is usually **title/keyword** and sometimes filters (genre, year).
- **Output:** Many rows of titles; you scroll and choose.
- **Difference:** Optimized for **engagement and retention** inside *their* catalog. They don’t ask “how do you feel?”; they infer preference from behavior. Feelvie doesn’t use your watch history; it uses **what you say right now** (and optional chat).

---

## IMDb, Google, JustWatch, etc. (generic movie search)

- **Input:** You type a **title**, **actor**, **director**, or **genre/keywords**.
- **Processing:** **Exact or keyword match** (and filters). No mood or emotional intent—just “find things that match these terms.”
- **Output:** A **list of results** (often many). You refine or click through.
- **Difference:** Built for **lookup and filter**, not for “I feel like this, suggest one thing.” Feelvie inverts that: you describe the *feeling*, and it suggests *one* movie (and can chat to refine).

---

## Summary: what makes Feelvie different

1. **Mood- and intent-first** – You don’t have to know genre or title; you describe how you feel or what vibe you want.
2. **Natural language** – Phrases like “sad and want something uplifting” or “something like Interstellar” drive the recommendation, not dropdowns or strict keywords.
3. **One recommendation at a time** – Focused on “what to watch now” instead of endless scrolling through rows.
4. **Optional chat** – A short conversation (match vs. lift mood, clarify vibe) before suggesting, instead of only typing one search box.
5. **No dependency on your history** – Works without login; when you are signed in, it still doesn’t rely on your past watches for the core recommendation (unlike Netflix’s “Because you watched”).
6. **Discovery, not catalog search** – Optimized for “I don’t know what I want, but I know how I feel,” not “Find me this exact movie or everything in this genre.”

So Feelvie’s “search engine” is less like Netflix or IMDb search and more like a **mood-based recommendation assistant**: you describe your state in words, and it picks one movie that fits (using AI + curated logic + external movie data).
