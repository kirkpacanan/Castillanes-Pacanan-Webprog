"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Shared playlist/categories section for Watch list and Watched pages.
 * @param {Object} props
 * @param {Array} props.playlists - List of { id, name, movieIds }
 * @param {string|null} props.activePlaylistId - Currently selected playlist id (null = All)
 * @param {Function} props.onSelectPlaylist - (id: string | null) => void
 * @param {Function} props.onDeletePlaylist - (id: string) => void
 * @param {Function} props.onRenamePlaylist - (id: string, newName: string) => void
 * @param {Function} props.onCreatePlaylist - () => void
 * @param {Array} props.items - Current page items (watchList or watched) for count
 */
export default function PlaylistCategories({
  playlists,
  activePlaylistId,
  onSelectPlaylist,
  onDeletePlaylist,
  onRenamePlaylist,
  onCreatePlaylist,
  items = [],
}) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const editingRef = useRef(null);

  const countInPlaylist = (pl) => items.filter((m) => pl.movieIds.includes(m.imdbID)).length;

  // Exit edit mode when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingRef.current && !editingRef.current.contains(e.target)) {
        setEditingId(null);
        setEditName("");
      }
    };

    if (editingId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [editingId]);

  const handleStartEdit = (pl) => {
    setEditingId(pl.id);
    setEditName(pl.name);
  };

  const handleConfirmRename = () => {
    const trimmed = (editName || "").trim();
    if (trimmed && trimmed !== playlists.find((p) => p.id === editingId)?.name) {
      onRenamePlaylist(editingId, trimmed);
    }
    setEditingId(null);
    setEditName("");
  };

  return (
    <section
      className="rounded-2xl border border-white/10 bg-slate-800/50 px-5 py-5 md:px-6 md:py-6"
      aria-label="Playlist categories"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Categories
          </h2>
          <p className="mt-0.5 text-sm text-white/50">
            Filter by playlist or create one to organize your movies.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreatePlaylist}
          className="mood-accent-dashed inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-out hover:scale-105 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New playlist
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectPlaylist(null)}
          className={`playlist-pill rounded-xl px-4 py-2 text-sm font-medium text-white transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            activePlaylistId === null
              ? "playlist-pill--active shadow-md hover:scale-105 active:scale-95"
              : "bg-slate-700 text-white/90 hover:bg-slate-600 hover:scale-105"
          }`}
        >
          All
          <span className="ml-1.5 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
            {items.length}
          </span>
        </button>
        {playlists.map((pl) => {
          const count = countInPlaylist(pl);
          const isActive = activePlaylistId === pl.id;
          const isEditing = editingId === pl.id;

          return (
            <div
              key={pl.id}
              ref={isEditing ? editingRef : null}
              className={`playlist-pill inline-flex items-center gap-1 rounded-xl border transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 hover:scale-105 ${
                isActive
                  ? "playlist-pill--active border-red-500/50 bg-red-600 text-white shadow-md"
                  : "border-white/10 bg-slate-700 text-white/90 hover:bg-slate-600"
              }`}
            >
              {isEditing ? (
                <div className="flex items-center gap-1 pl-4 pr-2 py-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleConfirmRename()}
                    className="playlist-edit-input w-24 rounded border border-white/20 bg-slate-800 px-2 py-1 text-sm text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleConfirmRename}
                    className="rounded p-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Confirm rename"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditName("");
                    }}
                    className="rounded p-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Cancel rename"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onSelectPlaylist(pl.id)}
                    className={`${isActive ? "rounded-l-xl" : "rounded-r-xl"} pl-4 pr-2 py-2 text-left text-sm font-medium transition-opacity duration-200 hover:opacity-90`}
                  >
                    {pl.name}
                    <span
                      className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                        isActive ? "bg-white/20" : "bg-white/20"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                  {isActive && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(pl);
                        }}
                        className="p-2 transition hover:bg-white/20"
                        aria-label={`Rename playlist ${pl.name}`}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePlaylist(pl.id);
                          if (isActive) onSelectPlaylist(null);
                        }}
                        className="rounded-r-xl p-2 transition hover:bg-white/20"
                        aria-label={`Delete playlist ${pl.name}`}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
