"use client";

import { useState, useRef, useEffect } from "react";

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
  label = "Add to playlist",
}) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const dropdownRef = useRef(null);

  const containing = getPlaylistsContaining(imdbID);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setCreating(false);
        setEditingId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreate = () => {
    const name = newName.trim();
    if (name) {
      createPlaylist(name);
      setNewName("");
      setCreating(false);
    }
  };

  const handleRename = () => {
    if (editingId && editName.trim()) {
      renamePlaylist(editingId, editName.trim());
      setEditingId(null);
      setEditName("");
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white/80 hover:border-red-500 hover:bg-white/5"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        {label}
      </button>
      {open && (
        <div className="absolute left-full top-0 z-50 ml-2 w-64 max-h-96 flex flex-col rounded-xl border border-white/10 bg-slate-800 shadow-lg overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {containing.length > 0 && (
              <div className="border-b border-white/10 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  In playlists
                </p>
                {containing.map((p) => (
                  <div
                    key={p.id}
                    className="mt-1 flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-700"
                  >
                    {editingId === p.id ? (
                      <div className="flex flex-1 items-center gap-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleRename()}
                          className="flex-1 rounded border border-white/20 bg-transparent px-2 py-0.5 text-sm text-white"
                          autoFocus
                        />
                        <button type="button" onClick={handleRename} className="text-xs text-red-400">
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="truncate text-sm text-white">{p.name}</span>
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(p.id);
                              setEditName(p.name);
                            }}
                            className="rounded p-0.5 text-white/50 hover:bg-slate-600 hover:text-white"
                            aria-label="Rename playlist"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M6 17v-3a2 2 0 012-2h2.5M12 4.5v6m0 0l2-2m-2 2l-2-2" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMovieFromPlaylist(p.id, imdbID)}
                            className="rounded p-0.5 text-white/50 hover:bg-red-900/30 hover:text-red-400"
                            aria-label="Remove from playlist"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="px-2 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Add to
              </p>
              {playlists.filter((p) => !p.movieIds.includes(imdbID)).length === 0 && !creating && (
                <p className="mt-1 text-xs text-white/50">No other playlists. Create one below.</p>
              )}
              {playlists
                .filter((p) => !p.movieIds.includes(imdbID))
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addMovieToPlaylist(p.id, imdbID)}
                    className="mt-1 flex w-full items-center rounded-lg px-2 py-1.5 text-left text-sm text-white/80 hover:bg-slate-700"
                  >
                    {p.name}
                  </button>
                ))}
            </div>
          </div>
          {creating ? (
            <div className="flex items-center gap-1 border-t border-white/10 px-3 py-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Playlist name"
                className="flex-1 rounded border border-white/20 bg-slate-700 px-2 py-1.5 text-sm text-white placeholder:text-white/50"
                autoFocus
              />
              <button
                type="button"
                onClick={handleCreate}
                className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-500"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => { setCreating(false); setNewName(""); }}
                className="rounded px-2 py-1 text-xs text-white/70 hover:text-white/90 hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 rounded-lg border border-dashed border-white/20 px-3 py-2 text-sm text-white/60 hover:border-red-500 hover:text-red-400 border-t"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New playlist
            </button>
          )}
        </div>
      )}
    </div>
  );
}
