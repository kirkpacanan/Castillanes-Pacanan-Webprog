"use client";

import { useState, useRef, useEffect } from "react";
import CreatePlaylistModal from "./CreatePlaylistModal";
import ClientPortal from "./ClientPortal";
import { useMoodGlow } from "../context/MoodGlowContext";

const DEFAULT_MOOD = [178, 34, 34];

export default function PlaylistPicker({
  imdbID,
  playlists,
  getPlaylistsContaining,
  isMovieInPlaylist,
  addMovieToPlaylist,
  removeMovieFromPlaylist,
  createPlaylist,
  deletePlaylist,
  renamePlaylist,
  className = "",
  label = "Playlists",
  type = "watchlist",
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const { moodGlowColor } = useMoodGlow();
  const [r, g, b] = moodGlowColor ?? DEFAULT_MOOD;

  const containing = getPlaylistsContaining(imdbID);

  const handleRename = () => {
    if (editingId && editName.trim()) {
      renamePlaylist(editingId, editName.trim());
      setEditingId(null);
      setEditName("");
    }
  };

  const handleCreatePlaylist = (name, type) => {
    createPlaylist(name, type);
    setCreatePlaylistOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`playlist-picker-trigger inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white/80 transition-all duration-300 ease-out hover:scale-105 hover:bg-white/5 active:scale-95 ${className}`}
        aria-expanded={modalOpen}
        aria-haspopup="dialog"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        {label}
      </button>

      {/* Playlist Modal */}
      {modalOpen && (
        <ClientPortal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4" onClick={() => setModalOpen(false)} role="dialog" aria-modal="true">
            <div
              className="app-mood glass w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              style={{ ["--mood-r"]: r, ["--mood-g"]: g, ["--mood-b"]: b }}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0">
              <h3 className="text-xl font-semibold text-white">Manage Playlists</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* In Playlists Section */}
              {containing.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">
                    In playlists
                  </p>
                  <div className="space-y-2">
                    {containing.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-2 rounded-lg px-3 py-3 bg-slate-800/50 border border-white/5 hover:bg-slate-800 hover:border-white/10 transition-all duration-200"
                      >
                        {editingId === p.id ? (
                          <div className="flex flex-1 items-center gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleRename()}
                              className="playlist-edit-input flex-1 rounded border border-white/20 bg-slate-700 px-2 py-1.5 text-sm text-white focus:outline-none"
                              autoFocus
                            />
                            <button type="button" onClick={handleRename} className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors">
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="truncate text-sm text-white">{p.name}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingId(p.id);
                                  setEditName(p.name);
                                }}
                                className="rounded p-1.5 text-white/50 hover:bg-slate-700 hover:text-white transition-all duration-200"
                                aria-label="Rename playlist"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => removeMovieFromPlaylist(p.id, imdbID)}
                                className="mood-accent-remove rounded p-1.5 text-white/50 transition-all duration-200"
                                aria-label="Remove from playlist"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Playlists Section */}
              {playlists.filter((p) => !p.movieIds.includes(imdbID)).length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">
                    Add to
                  </p>
                  <div className="space-y-2">
                    {playlists
                      .filter((p) => !p.movieIds.includes(imdbID))
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => addMovieToPlaylist(p.id, imdbID)}
                          className="playlist-add-item w-full flex items-center rounded-lg px-3 py-2 text-left text-sm text-white/80 bg-slate-800/50 border border-white/5 transition-all duration-200"
                        >
                          {p.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {playlists.length === 0 && containing.length === 0 && (
                <p className="text-sm text-white/50 text-center py-6">No playlists yet. Create one to get started!</p>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-6 py-4 shrink-0">
              <button
                type="button"
                onClick={() => setCreatePlaylistOpen(true)}
                className="mood-accent-dashed w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-sm font-medium transition-all duration-300 ease-out hover:scale-105 active:scale-95"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Playlist
              </button>
            </div>
          </div>
          </div>
        </ClientPortal>
      )}

      {/* Create Playlist Modal */}
      <ClientPortal>
        <CreatePlaylistModal
          open={createPlaylistOpen}
          onClose={() => setCreatePlaylistOpen(false)}
          onCreate={handleCreatePlaylist}
          type={type}
        />
      </ClientPortal>
    </>
  );
}
