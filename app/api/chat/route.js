const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || "AIzaSyBJFpPR5Hx-afU8vJCptkuRuXtiX6e_YXc";

const MOOD_KEYWORDS = {
  sad: ["sad", "down", "lonely", "heartbroken", "grief", "cry"],
  anxious: ["anxious", "nervous", "worried", "stress", "overwhelmed"],
  angry: ["angry", "mad", "frustrated", "irritated"],
  tired: ["tired", "exhausted", "drained", "burnt"],
  happy: ["happy", "excited", "joy", "good", "great"]
};

const PREFER_MATCH = ["match", "same", "similar", "current", "mirror"];
const PREFER_UPLIFT = ["uplift", "cheer", "improve", "better", "light", "fun"];
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

const extractYear = (text) => {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : null;
};

const buildFallbackResponse = (messages) => {
  const lastUser = [...messages].reverse().find((msg) => msg.role === "user");
  const text = lastUser?.content || "";
  const mood =
    detectMood(text) ||
    messages
      .map((msg) => msg.content)
      .map(detectMood)
      .find(Boolean) ||
    "neutral";
  const preference =
    detectPreference(text) ||
    messages
      .map((msg) => msg.content)
      .map(detectPreference)
      .find(Boolean);
  const year =
    extractYear(text) ||
    messages
      .map((msg) => msg.content)
      .map(extractYear)
      .find(Boolean);

  if (!preference) {
    if (detectSmallTalk(text)) {
      return {
        reply:
          "I’m CineSense, your movie companion. I’m here to chat and help you find something to watch. How are you feeling right now?",
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

const callOpenAI = async (messages) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a warm, supportive movie companion. Respond with empathy, short and natural. If the user greets you or chats casually, respond naturally before asking about how they feel. Analyze mood and ask whether they want a movie that matches their mood or lifts it. If a release year is mentioned, include it. Respond ONLY with JSON: {\"reply\":\"\", \"mood\":\"\", \"preference\":\"match|uplift|\", \"action\":\"recommend|\", \"prompt\":\"\", \"year\":\"\"}."
        },
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

const callGemini = async (messages) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "You are a warm, supportive movie companion named CineSense. Respond with empathy, short and natural. If the user greets you or asks about you, respond naturally before asking about how they feel. Only recommend a movie AFTER the user explicitly chooses match or uplift. If a release year is mentioned, include it. Respond ONLY with JSON: {\"reply\":\"\", \"mood\":\"\", \"preference\":\"match|uplift|\", \"action\":\"recommend|\", \"prompt\":\"\", \"year\":\"\"}."
              }
            ]
          },
          ...messages.map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }]
          }))
        ],
        generationConfig: {
          temperature: 0.4
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error("Gemini request failed");
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  const parsed = parseJson(content || "");
  if (!parsed) {
    throw new Error("Gemini returned invalid JSON");
  }
  return parsed;
};

export async function POST(request) {
  const { messages } = await request.json();
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      { message: "Please include chat messages." },
      { status: 400 }
    );
  }

  if (!GEMINI_API_KEY) {
    return Response.json(
      { message: "Missing Gemini API key. Set GEMINI_API_KEY." },
      { status: 500 }
    );
  }

  try {
    const result = await callGemini(messages);
    return Response.json(result);
  } catch (error) {
    // fall back to heuristic response
  }

  const fallback = buildFallbackResponse(messages);
  return Response.json(fallback);
}
