"use client";

import { createContext, useContext, useState } from "react";

const MoodGlowContext = createContext(null);

const DEFAULT_MOOD_COLOR = [178, 34, 34]; // red

export function MoodGlowProvider({ children }) {
  const [moodGlowColor, setMoodGlowColor] = useState(DEFAULT_MOOD_COLOR);
  return (
    <MoodGlowContext.Provider value={{ moodGlowColor, setMoodGlowColor }}>
      {children}
    </MoodGlowContext.Provider>
  );
}

export function useMoodGlow() {
  const ctx = useContext(MoodGlowContext);
  if (!ctx) {
    return {
      moodGlowColor: DEFAULT_MOOD_COLOR,
      setMoodGlowColor: () => {},
    };
  }
  return ctx;
}
