const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MOOD_KEYWORDS = {
  sad: [
    "sad",
    "down",
    "lonely",
    "heartbroken",
    "grief",
    "cry",
    "not good",
    "not ok",
    "bad",
    "not so great",
    "broke up",
    "break up",
    "heartbreak"
  ],
  anxious: ["anxious", "nervous", "worried", "stress", "overwhelmed"],
  angry: ["angry", "mad", "frustrated", "irritated"],
  tired: ["tired", "exhausted", "drained", "burnt"],
  happy: ["happy", "excited", "joy", "good", "great"]
};

const PREFER_MATCH = [
  "match",
  "same",
  "similar",
  "current",
  "mirror",
  "stay",
  "keep",
  "as is",
  "match my mood",
  "based on how i feel"
];
const PREFER_UPLIFT = [
  "uplift",
  "lift",
  "cheer",
  "cheer me up",
  "improve",
  "better",
  "light",
  "fun",
  "make me feel better",
  "pick me up",
  "brighten",
  "uplifting"
];
const GREETINGS = ["hi", "hello", "hey", "good morning", "good afternoon"];
const SMALL_TALK = [
  "your name",
  "who are you",
  "what are you",
  "what's your name",
  "whats your name",
  "talk to me",
  "chat"
];
const ANOTHER_REQUESTS = [
  "another",
  "one more",
  "again",
  "new one",
  "different",
  "another one"
];
const INTRO_PATTERNS = [
  "i'm ",
  "im ",
  "i am ",
  "my name is "
];

const MOOD_PROMPTS = {
  sad: {
    match: "an emotional drama about sadness and healing",
    uplift: "an uplifting, feel-good movie about hope and friendship"
  },
  anxious: {
    match: "a tense drama about overcoming anxiety",
    uplift: "a calming, lighthearted movie with warm humor"
  },
  angry: {
    match: "a gritty drama that channels anger into resilience",
    uplift: "a fun, uplifting comedy with positive energy"
  },
  tired: {
    match: "a quiet, reflective drama with a gentle pace",
    uplift: "a cozy, comforting movie that's easy to watch"
  },
  happy: {
    match: "an energetic, upbeat movie with joyful vibes",
    uplift: "a feel-good adventure that keeps the good mood going"
  },
  neutral: {
    match: "an emotional drama with heartfelt storytelling",
    uplift: "a light, funny, and uplifting movie"
  }
};

const parseJson = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch (innerError) {
      return null;
    }
  }
};

const detectMood = (text) => {
  const lower = text.toLowerCase();
  for (const [mood, words] of Object.entries(MOOD_KEYWORDS)) {
    if (words.some((word) => lower.includes(word))) {
      return mood;
    }
  }
  return null;
};

const detectPreference = (text) => {
  const lower = text.toLowerCase();
  if (PREFER_MATCH.some((word) => lower.includes(word))) return "match";
  if (PREFER_UPLIFT.some((word) => lower.includes(word))) return "uplift";
  return null;
};

const detectGreeting = (text) => {
  const lower = text.toLowerCase();
  return GREETINGS.some((word) => lower.includes(word));
};

const detectSmallTalk = (text) => {
  const lower = text.toLowerCase();
  return SMALL_TALK.some((phrase) => lower.includes(phrase));
};

const detectAnother = (text) => {
  const lower = text.toLowerCase();
  return ANOTHER_REQUESTS.some((phrase) => lower.includes(phrase));
};

const detectIntro = (text) => {
  const lower = text.toLowerCase();
  return INTRO_PATTERNS.some((pattern) => lower.startsWith(pattern));
};

const getWebsiteKnowledgeFallbackReply = (text) => {
  const lower = text.toLowerCase();
  if (/\b(who|developers?|built|made|created)\b/.test(lower)) {
    return "Feelvie was developed by Nicholas Klein Y. Castillanes and Kirk Roden C. Pacanan, both 2nd Year BSCS students at Mapúa Malayan Colleges Mindanao. They're passionate about AI-powered experiences and clean, user-focused interfaces. Want a movie recommendation?";
  }
  if (/\b(how\s+(does|do)|work|process)\b/.test(lower)) {
    return "Feelvie works like this: you type how you're feeling in plain language, our AI reads the tone and emotion, and you get movie recommendations that match. No genres or filters—just your mood. You can refine by trying different words. No account needed to try it!";
  }
  if (/\b(contact|support|reach|email)\b/.test(lower)) {
    return "You can reach us through the Contact page on the website—there's a form for support, feedback, or collaboration. Just head to the Contact link in the menu.";
  }
  if (/\b(what is|about)\s*feelvie\b|\bfeelvie\s*is\b/.test(lower)) {
    return "Feelvie is an AI-powered movie discovery platform. You tell us how you feel, and we recommend films that match your mood. It's free, no sign-up required to get recommendations. Accounts are optional for saving watch lists. Want to try a recommendation?";
  }
  return null;
};

const extractName = (text) => {
  const lower = text.toLowerCase();
  if (lower.startsWith("my name is ")) {
    return text.slice(11).trim();
  }
  if (lower.startsWith("i am ")) {
    return text.slice(5).trim();
  }
  if (lower.startsWith("i'm ")) {
    return text.slice(4).trim();
  }
  if (lower.startsWith("im ")) {
    return text.slice(3).trim();
  }
  return "";
};

const extractYear = (text) => {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : null;
};

const getUserMessages = (messages) =>
  messages.filter((msg) => msg.role === "user");

const inferPreferenceFromMessages = (messages) => {
  const userMessages = getUserMessages(messages);
  return (
    userMessages
      .map((msg) => msg.content)
      .map(detectPreference)
      .find(Boolean) || ""
  );
};

const extractGenreTags = (text) => {
  const lower = text.toLowerCase();
  const tags = [];
  if (lower.includes("teen")) tags.push("teen");
  if (lower.includes("love") || lower.includes("romance")) tags.push("romance");
  if (lower.includes("coming of age")) tags.push("coming-of-age");
  if (lower.includes("comedy") || lower.includes("funny")) tags.push("comedy");
  if (lower.includes("drama")) tags.push("drama");
  if (lower.includes("sci-fi") || lower.includes("science fiction"))
    tags.push("sci-fi");
  if (lower.includes("horror")) tags.push("horror");
  if (lower.includes("thriller")) tags.push("thriller");
  return [...new Set(tags)];
};

const buildPromptFromContext = (preference, mood, userText, tags = []) => {
  const base =
    MOOD_PROMPTS[mood]?.[preference] || MOOD_PROMPTS.neutral[preference];
  const tagLine = tags.length ? ` with ${tags.join(", ")}` : "";
  return `${base}${tagLine}. User context: "${userText}"`;
};

const inferMoodFromMessages = (messages) => {
  const userMessages = getUserMessages(messages);
  return (
    userMessages
      .map((msg) => msg.content)
      .map(detectMood)
      .find(Boolean) || "neutral"
  );
};

const buildFallbackResponse = (messages) => {
  const userMessages = getUserMessages(messages);
  const lastUser = [...userMessages].reverse()[0];
  const text = lastUser?.content || "";
  const mood = detectMood(text) || inferMoodFromMessages(messages);
  const preference = detectPreference(text);
  const year =
    extractYear(text) ||
    userMessages
      .map((msg) => msg.content)
      .map(extractYear)
      .find(Boolean);

  const websiteReply = getWebsiteKnowledgeFallbackReply(text);
  if (websiteReply) {
    return { reply: websiteReply, mood, year };
  }

  if (!preference) {
    if (detectSmallTalk(text)) {
      return {
        reply:
          "I’m Feelvie, your movie companion. I’m here to chat and help you find something to watch. How are you feeling right now?",
        mood,
        year
      };
    }
    if (detectGreeting(text)) {
      return {
        reply:
          "Hey! I’m here to chat and help you find a movie. How are you feeling right now?",
        mood,
        year
      };
    }
    if (detectAnother(text)) {
      const lastPreference = inferPreferenceFromMessages(messages);
      if (lastPreference) {
        return {
          reply:
            lastPreference === "match"
              ? "Got it. I’ll match the mood and find something fitting."
              : "Absolutely. I’ll look for something light and uplifting.",
          mood,
          preference: lastPreference,
          year,
          action: "recommend",
          prompt:
            MOOD_PROMPTS[mood]?.[lastPreference] ||
            MOOD_PROMPTS.neutral[lastPreference]
        };
      }
    }
    return {
      reply:
        "Thanks for sharing that. Want a movie that matches how you feel, or something to lift your mood?",
      mood,
      year
    };
  }

  return {
    reply:
      preference === "match"
        ? "Got it. I’ll match the mood and find something fitting."
        : "Absolutely. I’ll look for something light and uplifting.",
    mood,
    preference,
    year,
    action: "recommend",
    prompt: MOOD_PROMPTS[mood]?.[preference] || MOOD_PROMPTS.neutral[preference]
  };
};

const WEBSITE_KNOWLEDGE = `
You have full knowledge of the Feelvie website. Use this when users ask about the site, who made it, how it works, contact, etc.

**What is Feelvie**
- Feelvie is an AI-powered movie discovery platform that recommends films based on the user's mood and emotions.
- Mission: reduce decision fatigue by honoring how people feel. The platform uses AI to understand how users feel and recommend films that match their emotional state.
- It's free. No sign-up is required to get movie recommendations; users can type how they're feeling and get matches. Accounts are optional (for saving watch lists, marking films as watched, and reviews).

**How it works (from the How it works page)**
1. User types what they're feeling (a sentence or phrase that captures their mood).
2. The AI analyzes the words, tone, and emotional weight to find the right match.
3. User gets films matched to their emotional state, not just genre.
- Search: type how you feel in plain language; no genres, no filters—just mood.
- Explore: browse recommendations tailored to the emotional vibe described.
- Refine: try different words; each phrase surfaces new matches.
- Browse: discover films by feeling; save to list or mark as watched when signed in.
- Zero friction: share a mood in a sentence and get a match instantly.
- Emotion mapping: the system reads tone, intensity, and context to guide results.
- Full control: refine with a new phrase to shift the vibe.
- FAQ: No account needed to discover films. Recommendations improve when the user is more specific. With an account, users can suggest movies or mood categories. Data is private; searches are processed to find films and personal data is not stored without an account.

**Developers (About page)**
- The website was developed by two students:
  - Nicholas Klein Y. Castillanes – 2nd Year BSCS at Mapúa Malayan Colleges Mindanao. Passionate about building AI-powered experiences and clean, user-focused interfaces.
  - Kirk Roden C. Pacanan – 2nd Year BSCS at Mapúa Malayan Colleges Mindanao. Passionate about building AI-powered experiences and clean, user-focused interfaces.

**Features (About page)**
- AI-powered mood-based recommendations.
- Personalized movie discovery.
- Clean and minimal user interface.
- Fast and efficient browsing.
- Project snapshot: Mood-first matching (every prompt analyzed for tone and intent), Curated discovery (films aligned with emotional context), Designed for focus (minimal interface).

**Contact**
- Users can reach the team via the Contact page on the website for support, feedback, or collaboration. The site mentions "Before you send" tips and "What helps us most" (what they were trying to find, preferred mood/theme, any issues).
`;

const CHAT_SYSTEM_PROMPT = `You are Feelvie, a warm, smart movie companion. Your replies should feel natural, empathetic, and conversational—like a friend who loves films and cares how the user feels.
${WEBSITE_KNOWLEDGE}

Guidelines for "reply":
- Be genuinely responsive to what they said. Reference their words or mood when relevant.
- When users ask about the website, who developed it, how it works, contact info, features, or anything in the website knowledge above: answer clearly and concisely from that knowledge. Put your full answer in "reply". Do not set action "recommend" for these questions.
- For greetings or small talk: respond in a warm, personal way (one or two short sentences), then gently steer toward how they're feeling or what they want to watch.
- For mood or preference: acknowledge how they feel, then confirm whether they want a movie that matches that mood or something to lift their spirits. Keep it brief but human.
- When recommending: give a short, friendly lead-in, then we'll show a movie—so your reply can be encouraging and concise.
- Vary your phrasing. Avoid repeating the same stock phrases. Sound like a real person, not a script.

Behavior (for JSON fields):
- Detect mood: sad, anxious, happy, tired, angry, or neutral from their message or conversation.
- If they want a movie that "matches" or "reflects" their mood, set preference "match". If they want to "feel better", "cheer up", or "lift mood", set "uplift".
- Only set action "recommend" and a non-empty "prompt" when the user clearly wants a movie recommendation (e.g. chose match/uplift, or said "find me a movie", "suggest something"). Do NOT set action "recommend" when they are only asking about the website, developers, how it works, or contact.
- "prompt" must be a short search phrase for the recommender (e.g. "emotional drama about healing", "cozy feel-good comedy").
- If a release year is mentioned, set "year" (4-digit string).

Respond ONLY with valid JSON: {"reply":"", "mood":"", "preference":"match|uplift|", "action":"recommend|", "prompt":"", "year":""}. Always include a non-empty "reply"; set other fields when relevant.`;

const callOpenAI = async (messages) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.4
    })
  });

  if (!response.ok) {
    throw new Error("OpenAI request failed");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  const parsed = parseJson(content || "");
  if (!parsed) {
    throw new Error("OpenAI returned invalid JSON");
  }
  return parsed;
};

// Use gemini-2.5-flash (free tier). Fallback to gemini-flash-latest if 404.
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-flash-latest"];

const callGeminiWithModel = async (model, messages) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: CHAT_SYSTEM_PROMPT }]
        },
        contents: messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }]
        })),
        generationConfig: {
          temperature: 0.5,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
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
    const msg = data?.error?.message || bodyText || "Gemini request failed";
    const err = new Error(msg);
    err.status = response.status;
    err.code = data?.error?.code;
    throw err;
  }

  const candidate = data.candidates?.[0];
  if (!candidate?.content?.parts?.length) {
    const blockReason = candidate?.finishReason || data.promptFeedback?.blockReason || "unknown";
    throw new Error(`Gemini did not return text (${blockReason}). Try again.`);
  }

  const content = candidate.content.parts[0].text?.trim();
  const parsed = parseJson(content || "");
  if (!parsed) {
    throw new Error("Gemini returned invalid JSON");
  }
  return parsed;
};

const callGemini = async (messages) => {
  let lastError;
  for (const model of GEMINI_MODELS) {
    try {
      return await callGeminiWithModel(model, messages);
    } catch (err) {
      lastError = err;
      const isNotFound = err?.status === 404 || (err?.message && String(err.message).includes("404"));
      if (isNotFound) continue;
      throw err;
    }
  }
  throw lastError || new Error("Gemini request failed");
};

const normalizeChatResult = (result) => {
  if (!result || typeof result !== "object") {
    throw new Error("Invalid Gemini response");
  }

  if (!result.reply || typeof result.reply !== "string") {
    throw new Error("Gemini response missing reply");
  }

  if (result.action === "recommend" && !result.prompt) {
    return {
      ...result,
      action: "",
      prompt: ""
    };
  }

  return result;
};

export async function POST(request) {
  const { messages } = await request.json();
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      { message: "Please include chat messages." },
      { status: 400 }
    );
  }

  // Prefer Gemini 2.0 Flash (free). When key is set, use it only—no silent fallback to local.
  if (GEMINI_API_KEY) {
    try {
      const result = await callGemini(messages);
      const normalized = normalizeChatResult(result);
      return Response.json({ ...normalized, engine: "gemini" });
    } catch (error) {
      // Optional: one retry on transient failure
      try {
        const result = await callGemini(messages);
        const normalized = normalizeChatResult(result);
        return Response.json({ ...normalized, engine: "gemini" });
      } catch (retryError) {
        const errMsg = retryError?.message || "Gemini request failed";
        const isKeyError = /API key|403|401|invalid.*key|INVALID_ARGUMENT/i.test(errMsg);
        return Response.json(
          {
            message: isKeyError
              ? "Invalid or restricted Gemini API key. Check GEMINI_API_KEY in .env.local and get a key from aistudio.google.com"
              : errMsg,
            engine: "gemini",
            error: errMsg
          },
          { status: 503 }
        );
      }
    }
  }

  try {
    if (OPENAI_API_KEY) {
      const result = await callOpenAI(messages);
      const normalized = normalizeChatResult(result);
      return Response.json({ ...normalized, engine: "openai" });
    }
  } catch (error) {
    // no-op
  }

  const fallback = buildFallbackResponse(messages);
  return Response.json({
    ...fallback,
    engine: "local"
  });
}
