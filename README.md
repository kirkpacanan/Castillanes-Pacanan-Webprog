# Feelvie

AI-powered movie recommender built with Next.js, Tailwind CSS, OpenAI, Gemini, and the OMDb API. Describe how you feel and get movie recommendations—or chat with Feelvie to find something that matches or lifts your mood.

---

## Step-by-step setup

### 1. Prerequisites

- **Node.js** 18.x or newer ([nodejs.org](https://nodejs.org))
- **npm** (comes with Node.js)

Check versions in a terminal:

```bash
node -v   # e.g. v20.x
npm -v    # e.g. 10.x
```

### 2. Get the project

If you’re cloning from GitHub:

```bash
git clone https://github.com/your-username/Castillanes-Pacanan-Webprog.git
cd Castillanes-Pacanan-Webprog
```

If you already have the folder, just open it in the terminal and go to step 3.

### 3. Install dependencies

From the **project root** (the folder that contains `package.json`):

```bash
npm install
```

Wait until it finishes. You should see something like “added XXX packages.”

### 4. Create environment variables

Create a file named **`.env.local`** in the **project root** (same folder as `package.json`).

**Required for movie search and recommendations:**

- **OMDB_API_KEY** – Get a free key at [omdbapi.com](https://www.omdbapi.com/apikey.aspx) (choose “FREE” 1,000 requests/day).

**Required for Mood Chat:**

- **GEMINI_API_KEY** – Get a key in [Google AI Studio](https://aistudio.google.com/app/apikey). Create an API key and paste it here.

**Optional (improves recommendations):**

- **OPENAI_API_KEY** – From [platform.openai.com](https://platform.openai.com/api-keys). If set, the recommender uses GPT to analyze your prompt; if not, a rule-based fallback is used.

**Example `.env.local` (replace with your own keys):**

```env
OMDB_API_KEY=your_omdb_key_here
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
```

- Use **plain key=value** (no quotes, no spaces around `=`).
- Do **not** commit `.env.local` or share it; it’s for your machine only.

### 5. Start the dev server

```bash
npm run dev
```

You should see something like:

```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

Open **http://localhost:3000** in your browser. You can type a mood (e.g. “sad and want something uplifting”) or use Mood Chat.

### 6. (Optional) Sign up, sign-in, and Google login

To enable **user accounts** (sign up, sign in, “Continue with Google”) and **saving watch list / playlists**:

1. Create a project at [Supabase](https://supabase.com) and get your **Project URL**, **anon** key, and **service_role** key.
2. In Supabase, run the SQL from **`DATABASE.md`** to create the `users` and (optionally) `user_watchlist_sync` tables.
3. Add these to `.env.local`:
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (for API sign-up/sign-in)
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for Google login and client auth)
4. For “Continue with Google,” follow the **Sign in with Google** section in `DATABASE.md` (Google Cloud Console + Supabase redirect URLs).

Full details: **[DATABASE.md](./DATABASE.md)**.

---

## Quick reference

| Task              | Command        |
|-------------------|----------------|
| Install deps      | `npm install`  |
| Run dev server    | `npm run dev`  |
| Production build  | `npm run build`|
| Start production  | `npm start`    |

---

## Features

- **Mood-based search** – Type how you feel or the vibe you want; get one movie recommendation.
- **Mood Chat** – Chat with Feelvie; it detects mood and asks if you want a movie that matches or lifts it, then recommends.
- **AI keyword extraction** – OpenAI (optional) or rule-based fallback turns your text into genre/mood/themes for matching.
- **OMDb integration** – Movie data (title, year, poster, plot) from the OMDb API.
- **Watch list & playlists** – When signed in (and Supabase is set up), save movies and organize them in playlists.
- **Dark mode** – Toggle in the UI.
