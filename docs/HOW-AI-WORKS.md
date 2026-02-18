# How the AI Works on Feelvie

This document explains the clear process of how your text (mood/feeling) is analyzed and how movies are chosen.

---

## Two Ways You Interact With the AI

1. **Direct search (home page)** – You type a phrase (e.g. “sad and want something uplifting”) and get one movie recommendation.
2. **Mood chat** – You chat with “Feelvie”; it detects your mood, asks if you want a movie that **matches** your mood or **lifts** it, then recommends a movie.

Both paths end up calling the **same recommendation engine** with a **text prompt**. The difference is how that prompt is built (directly from your input vs. from the chat AI).

---

## High-Level Flow

```
Your text (mood/feeling)
        ↓
   [Analysis step]
   Extract: genre, mood, themes, keywords, or a concrete movie title
        ↓
   [Matching step]
   Try, in order: specific title → curated fallback list → keyword search
        ↓
   [OMDb]
   Fetch real movie data (title, year, poster, plot) for the chosen movie
        ↓
   One movie recommendation shown to you
```

---

## Step 1: Analyzing Your Text

When you submit a phrase (e.g. “I feel sad and want a feel-good comedy” or “something like Interstellar”):

### If OpenAI is configured (`OPENAI_API_KEY`)

- Your **full prompt** is sent to **OpenAI (GPT-4o-mini)**.
- The model is asked to return **one** suggestion and structured data in JSON:
  - **title** – a concrete movie title (e.g. “The Secret Life of Walter Mitty”)
  - **year** – release year if mentioned or inferred
  - **genre** – e.g. comedy, drama, sci-fi
  - **mood** – e.g. uplifting, dark, emotional
  - **themes** – short list of themes
  - **keywords** – terms useful for search

So the AI **interprets** your sentence and turns it into a structured **analysis** (one suggested title + genre/mood/themes/keywords).

### If OpenAI is not configured

- A **rule-based fallback** runs on the same text:
  - **Genre**: matched against a fixed list (e.g. “comedy”, “sci-fi”, “romance”).
  - **Mood**: matched against a fixed list (e.g. “dark”, “uplifting”, “emotional”).
  - **Themes**: longer words (after removing stopwords) are used as theme/keyword terms.

So even without OpenAI, the site still derives **genre**, **mood**, and **keywords** from your text to drive the next step.

---

## Step 2: Choosing a Movie (Three Strategies in Order)

The recommendation API tries these in order until it finds a movie (and skips any you’ve already seen in this session via `excludeIds`).

### Strategy A: Use the AI-suggested title (if any)

- If the analysis step returned a **title** (from OpenAI or from a fallback list later), the app looks up that **exact title** in **OMDb** (by title + optional year).
- If OMDb returns a match and it’s not excluded → that movie is chosen and full details are fetched.
- If not found (e.g. wrong year), it retries with the title only (year relaxed).

### Strategy B: Curated fallback list (mood/theme/country)

- The code builds a list of **candidate movie titles** from:
  - **Mood bias**: e.g. if your text sounds “sad” → add titles from a “sad” / “emotional” list; if “uplift” → add “feel-good” / “uplifting” titles.
  - **Country/culture**: if you mention “Korean”, “Japanese”, “Filipino”, etc. → add titles from a per-country list.
  - **Genre/themes**: e.g. “sci-fi”, “romance”, “feel-good”, “twist” → add titles from predefined lists.
- It then tries each candidate title in **OMDb** (by title, optional year) until one returns a valid, non-excluded movie.
- So your text is **mapped to mood/theme/country**, and those map to **curated titles** the system already knows fit that vibe.

### Strategy C: Keyword search in OMDb

- A **search query** is built from:
  - The analysis **keywords** (genre, mood, themes from step 1), or
  - If no keywords, from important words in your **original prompt** (after normalizing and removing stopwords).
- Optional **year** is added if you (or the AI) specified one.
- The app calls **OMDb search** with this query (and optional year).
- The **first result** that isn’t in `excludeIds` is taken, then **full details** for that movie are fetched from OMDb by ID.

So here the AI’s job was to **reduce your sentence to searchable concepts**; OMDb does the actual “find movies by these terms.”

---

## Step 3: Returning the Movie

- The chosen movie is returned with:
  - Full OMDb data (title, year, poster, plot, etc.)
  - Optional **analysis** (genre, mood, themes, keywords) so the UI can show “why” this was picked (e.g. chips or tags).
- If **no** movie is found after all strategies, the API returns a “No matching movie found” style message and the UI can ask you to try a different prompt.

---

## How the Mood Chat Fits In

In **Mood Chat**:

1. Your messages are sent to **Gemini** (or OpenAI if configured) with a **system instruction**: you are “Feelvie”, a movie companion; respond with short, empathetic replies and **structured JSON**.
2. The model is asked to:
   - **Detect mood** (sad, anxious, happy, etc.) from what you said.
   - **Detect preference**: does the user want a movie that **matches** their mood or **lifts** it (“match” vs “uplift”)?
   - **Reply** in natural language (e.g. “Got it, I’ll find something uplifting”).
   - When it’s time to recommend: set `action: "recommend"` and fill **prompt** with a short, concrete description (e.g. “an uplifting, feel-good movie about hope and friendship”).
3. The **reply** is shown in the chat; the **prompt** is what gets sent to the **recommendation API** as the `prompt` in step 1 above.

So:

- **Chat AI** = understands conversation, mood, and intent → produces a **single text prompt** and optional year.
- **Recommendation AI** = takes that prompt (or your direct input) → analyzes it → picks a movie via title / fallback list / OMDb search → returns one movie.

---

## Summary Table

| Step | What happens |
|------|----------------------|
| **Input** | Your text: direct search box or last chat message + context. |
| **Analyze** | OpenAI (or fallback rules) extracts: suggested title, genre, mood, themes, keywords, year. |
| **Match** | 1) Try suggested title in OMDb → 2) Try curated titles (mood/theme/country) → 3) Search OMDb by keywords. |
| **Output** | One movie (OMDb data) + optional analysis (genre, mood, themes) for the UI. |

So: **the AI analyzes the text and turns it into either a concrete title or into genre/mood/keywords; then the app uses that plus curated lists and OMDb to choose a single movie to show you.**
