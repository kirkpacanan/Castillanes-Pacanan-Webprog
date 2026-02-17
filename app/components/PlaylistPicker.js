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
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-red-500 hover:bg-slate-50 dark:border-white/20 dark:text-white/80 dark:hover:border-red-500 dark:hover:bg-white/5"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        {label}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-slate-200 bg-white py-2 shadow-lg dark:border-white/10 dark:bg-slate-800">
          {containing.length > 0 && (
            <div className="border-b border-slate-200 px-3 pb-2 dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/50">
                In playlists
              </p>
              {containing.map((p) => (
                <div
                  key={p.id}
                  className="mt-1 flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {editingId === p.id ? (
                    <div className="flex flex-1 items-center gap-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleRename()}
                        className="flex-1 rounded border border-slate-300 bg-transparent px-2 py-0.5 text-sm dark:border-white/20 dark:text-white"
                        autoFocus
                      />
                      <button type="button" onClick={handleRename} className="text-xs text-red-600 dark:text-red-400">
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="truncate text-sm text-slate-900 dark:text-white">{p.name}</span>
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(p.id);
                            setEditName(p.name);
                          }}
                          className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-600 dark:hover:text-white"
                          aria-label="Rename playlist"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M6 17v-3a2 2 0 012-2h2.5M12 4.5v6m0 0l2-2m-2 2l-2-2" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeMovieFromPlaylist(p.id, imdbID)}
                          className="rounded p-0.5 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
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
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/50">
              Add to
            </p>
            {playlists.filter((p) => !p.movieIds.includes(imdbID)).length === 0 && !creating && (
              <p className="mt-1 text-xs text-slate-500 dark:text-white/50">No other playlists. Create one below.</p>
            )}
            {playlists
              .filter((p) => !p.movieIds.includes(imdbID))
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addMovieToPlaylist(p.id, imdbID)}
                  className="mt-1 flex w-full items-center rounded-lg px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-white/80 dark:hover:bg-slate-700"
                >
                  {p.name}
                </button>
              ))}
          </div>
          {creating ? (
            <div className="mt-2 flex items-center gap-1 border-t border-slate-200 px-3 pt-2 dark:border-white/10">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Playlist name"
                className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-white/20 dark:bg-slate-700 dark:text-white dark:placeholder:text-white/50"
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
                className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:text-white/70 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="mt-2 flex w-full items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 hover:border-red-500 hover:text-red-600 dark:border-white/20 dark:text-white/60 dark:hover:border-red-500 dark:hover:text-red-400"
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
