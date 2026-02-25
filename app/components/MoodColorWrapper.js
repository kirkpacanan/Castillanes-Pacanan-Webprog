"use client";

import { useMoodGlow } from "../context/MoodGlowContext";

const DEFAULT_MOOD = [178, 34, 34];

/** Wraps the app so --mood-r/g/b are set on all pages (How it works, About, Contact, etc.) */
export default function MoodColorWrapper({ children }) {
  const { moodGlowColor } = useMoodGlow();
  const [r, g, b] = moodGlowColor ?? DEFAULT_MOOD;

  return (
    <div
      className="app-mood min-h-screen flex flex-col"
      style={{
        ["--mood-r"]: r,
        ["--mood-g"]: g,
        ["--mood-b"]: b,
      }}
    >
      {children}
    </div>
  );
}
