"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useWatchlist } from "../../context/WatchlistContext";
import PosterPlaceholder from "../../components/PosterPlaceholder";
import PlaylistPicker from "../../components/PlaylistPicker";
import PlaylistCategories from "../../components/PlaylistCategories";

export default function WatchListPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const {
    watchList,
    removeFromWatchList,
    markWatched,
    playlists,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
    addMovieToPlaylist,
    removeMovieFromPlaylist,
    isMovieInPlaylist,
    getPlaylistsContaining,
  } = useWatchlist();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    if (hydrated && !user) router.replace("/signin");
  }, [user, hydrated, router]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setSelectedMovie(null);
  };

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  const filteredList = activePlaylistId
    ? watchList.filter((m) => isMovieInPlaylist(activePlaylistId, m.imdbID))
    : watchList;

  const handleCreatePlaylist = () => {
    const name = newPlaylistName.trim();
    if (name) {
      createPlaylist(name);
      setNewPlaylistName("");
      setShowCreatePlaylist(false);
    }
  };

  return (
    <div className="mx-auto w-[min(1280px,94%)] px-4 py-12 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Watch List
        </h1>
        <Link
          href="/"
          className="inline-block rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500"
        >
          Back to Home
        </Link>
      </div>

      <div className="mt-6">
        <PlaylistCategories
          playlists={playlists}
          activePlaylistId={activePlaylistId}
          onSelectPlaylist={setActivePlaylistId}
          onDeletePlaylist={(id) => {
            deletePlaylist(id);
            if (activePlaylistId === id) setActivePlaylistId(null);
          }}
          onCreatePlaylist={() => setShowCreatePlaylist(true)}
          items={watchList}
        />
      </div>

      {watchList.length === 0 ? (
        <p className="mt-6 text-slate-600 dark:text-white/70">
          No movies in your watch list. Add some from the home page.
        </p>
      ) : filteredList.length === 0 ? (
        <p className="mt-6 text-slate-600 dark:text-white/70">
          No movies in this category. Add movies from your list using &quot;Add to playlist&quot; on a movie.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredList.map((movie) => (
            <button
              type="button"
              key={movie.imdbID}
              onClick={() => setSelectedMovie(movie)}
              className="glass rounded-2xl overflow-hidden text-left transition hover:ring-2 hover:ring-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <div className="aspect-[2/3] bg-slate-200 dark:bg-slate-800">
                {movie.Poster && movie.Poster !== "N/A" ? (
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <PosterPlaceholder className="h-full w-full" />
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                  {movie.Title}
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-white/50">
                  {movie.Year} · ⭐ {movie.imdbRating}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Create playlist modal */}
      {showCreatePlaylist && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowCreatePlaylist(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Create playlist"
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">New playlist</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
              Create a category to organize your watch list.
            </p>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
              placeholder="e.g. Weekend picks, Favorites"
              className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 dark:border-white/20 dark:bg-slate-700 dark:text-white dark:placeholder:text-white/50"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleCreatePlaylist}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => { setShowCreatePlaylist(false); setNewPlaylistName(""); }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 dark:border-white/20 dark:text-white/80"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movie detail modal - opens when poster is clicked */}
      {selectedMovie && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="movie-modal-title"
        >
          <div
            className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedMovie(null)}
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 grid gap-6 md:grid-cols-[0.4fr_0.6fr]">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-800">
                  {selectedMovie.Poster && selectedMovie.Poster !== "N/A" ? (
                    <img
                      src={selectedMovie.Poster}
                      alt={selectedMovie.Title}
                      className="h-full w-full rounded-2xl object-contain"
                    />
                  ) : (
                    <PosterPlaceholder className="aspect-[2/3] w-full" />
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-500 dark:text-red-400">
                    {selectedMovie.Genre || "Movie"}
                  </p>
                  <h2 id="movie-modal-title" className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {selectedMovie.Title}
                  </h2>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-white/70">
                    <span>{selectedMovie.Year}</span>
                    <span>{selectedMovie.Runtime}</span>
                    <span>⭐ {selectedMovie.imdbRating}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-white/75">
                    {selectedMovie.Plot || "No description available."}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <PlaylistPicker
                      imdbID={selectedMovie.imdbID}
                      playlists={playlists}
                      getPlaylistsContaining={getPlaylistsContaining}
                      isMovieInPlaylist={isMovieInPlaylist}
                      addMovieToPlaylist={addMovieToPlaylist}
                      removeMovieFromPlaylist={removeMovieFromPlaylist}
                      createPlaylist={createPlaylist}
                      renamePlaylist={renamePlaylist}
                      deletePlaylist={deletePlaylist}
                      label="Playlists"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        markWatched(selectedMovie);
                        setSelectedMovie(null);
                      }}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-red-500 hover:text-slate-900 dark:border-white/20 dark:text-white/80 dark:hover:border-red-500 dark:hover:text-white"
                    >
                      Watched
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeFromWatchList(selectedMovie.imdbID);
                        setSelectedMovie(null);
                      }}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-red-500 hover:text-slate-900 dark:border-white/20 dark:text-white/80 dark:hover:border-red-500 dark:hover:text-white"
                    >
                      Remove from Watch list
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
