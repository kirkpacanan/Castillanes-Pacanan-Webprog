# OpenAI setup for Feelvie (search + Mood Chat)

## Free option: Gemini only

You can run **recommendations** and **Mood Chat** for free using only a Gemini API key:

1. Get a key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2. In `.env.local` set **only** `GEMINI_API_KEY` (you can leave `OPENAI_API_KEY` unset).
3. The app uses **Gemini first** for both features when `GEMINI_API_KEY` is set; no OpenAI key required.

If both keys are set, Gemini is still tried first (free tier); OpenAI is used only if Gemini is not configured or fails.

---

## 1. Get an API key (OpenAI, optional)

1. Go to [platform.openai.com](https://platform.openai.com) and sign in (or create an account).
2. Open **API keys** and create a new key.
3. Copy the key (it starts with `sk-`).

## 2. Add the key locally

In your project root, edit **`.env.local`** and add:

```env
OPENAI_API_KEY=sk-your-key-here
```

Restart the dev server after changing env vars (`npm run dev`).

## 3. What uses which API

| Feature | When `GEMINI_API_KEY` is set | When only `OPENAI_API_KEY` is set |
|--------|------------------------------|------------------------------------|
| **Search / recommendations** | Gemini analyzes your prompt (title, genre, mood, related movies); then OMDb is used for details. | Same with OpenAI. |
| **Mood Chat** | Chat uses Gemini first. | Chat uses OpenAI. If Gemini is set, it is tried first (free). |

With **only** `GEMINI_API_KEY` you get full AI behavior for free. With neither key, recommendations use rule-based keyword extraction and chat uses local fallback replies.

## 4. Model used (cost-efficient)

Both features use **`gpt-4.1-nano`**:

- OpenAI’s fastest, most cost-efficient model in the GPT-4.1 series.
- Strong at instruction following and tool/JSON-style output; 1M token context.
- Lower cost than `gpt-4o-mini`: ~\$0.10 per 1M input tokens, ~\$0.40 per 1M output tokens (see [OpenAI pricing](https://openai.com/api/pricing/) for current rates).

No fine-tuning or training is required. The app uses **prompt engineering** (clear system prompts + examples) so the model behaves like it’s “trained” for movie recommendations and mood chat without extra cost.

## 5. Making recommendations smarter (no extra cost)

The recommender prompt is already tuned to:

- Return only **real movie titles** that exist in OMDb.
- Use **exact official titles** and a **year** when possible.
- Fill **genre**, **mood**, and **themes** so search and fallbacks work well.
- Include a **related** list of real movies.

If you still see fallbacks often, check:

- **OMDb API key** – Invalid or over limit will cause “no movie found” even when OpenAI returns a valid title. Use your own key from [omdbapi.com](https://www.omdbapi.com/apikey.aspx) if needed.
- **Prompt wording** – Very vague prompts (“something good”) may get generic titles; more specific prompts (“cozy feel-good about friendship”) get better results.

## 6. Optional: use a different model

To switch to another model (e.g. `gpt-4.1-mini` or `gpt-4o` for higher quality at higher cost):

- **Recommendations:** In `app/api/recommend/route.js`, change the `model` field in the `callOpenAI` body from `"gpt-4.1-nano"` to your choice.
- **Mood Chat:** In `app/api/chat/route.js`, change the `model` field in the `callOpenAI` body.

Keeping `gpt-4.1-nano` is recommended for the best balance of cost, speed, and quality for this app.
