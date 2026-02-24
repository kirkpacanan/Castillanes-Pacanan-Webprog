"use client";

import { useState, useEffect, useRef } from "react";

export default function CreatePlaylistModal({ open, onClose, onCreate, type = "watchlist" }) {
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName("");
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  if (!open) return null;

  const handleConfirm = () => {
    const trimmed = (name || "").trim();
    if (!trimmed) return;
    onCreate(trimmed, type);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">New playlist</h3>
          <button type="button" onClick={onClose} className="rounded p-1 text-white/50 hover:bg-slate-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-sm text-white/70">Create a new playlist for the {type === "watched" ? "Watched" : "Watch list"} section.</p>

        <div className="mt-4">
          <label className="text-xs text-white/60">Playlist name</label>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            className="mt-2 w-full rounded border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white"
            placeholder="Enter a name"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
          >
            Create
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/80 hover:border-white/20"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
