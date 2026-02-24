"use client";

import PlaylistPicker from "./PlaylistPicker";
import PosterPlaceholder from "./PosterPlaceholder";

export default function MovieModal({
  movie,
  onClose,
  watchlistPlaylists,
  watchedPlaylists,
  getPlaylistsContaining,
  isMovieInPlaylist,
  addMovieToPlaylist,
  removeMovieFromPlaylist,
  createPlaylist,
  renamePlaylist,
  deletePlaylist,
  actionButtons,
  isInWatchList,
  isWatched,
  onToggleWatchlist,
  onToggleWatched,
  user,
  onSignIn,
}) {
  if (!movie) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-modal-title"
    >
      <div
        className="glass flex h-[85vh] w-full max-w-6xl flex-col rounded-3xl shadow-2xl transition-all duration-300 sm:max-h-[90vh] sm:h-auto sm:max-w-5xl md:max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex shrink-0 justify-end px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/50 transition-colors hover:bg-slate-700 hover:text-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content Area with Poster and Details */}
        <div className="flex min-h-0 flex-1 gap-4 overflow-hidden px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 md:gap-8">
          {/* Left: Fixed Poster Container */}
          <div className="shrink-0">
            <div className="w-40 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-800 sm:w-48 md:w-56">
              {movie.Poster && movie.Poster !== "N/A" ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="aspect-[2/3] w-full object-cover"
                />
              ) : (
                <PosterPlaceholder className="aspect-[2/3] w-full" />
              )}
            </div>
          </div>

          {/* Right: Scrollable Details */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-2 sm:pr-3">
            <div className="flex flex-col gap-3 pb-4 sm:pb-6 md:pb-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-500 dark:text-red-400">
                {movie.Genre || "Movie"}
              </p>
              <h2 id="movie-modal-title" className="text-2xl font-bold text-white md:text-3xl">
                {movie.Title}
              </h2>
              <div className="flex flex-wrap gap-3 text-sm text-slate-400 dark:text-white/70">
                <span>{movie.Year}</span>
                {movie.Runtime && <span>•</span>}
                <span>{movie.Runtime}</span>
                {movie.imdbRating && <span>•</span>}
                <span>⭐ {movie.imdbRating}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300 dark:text-white/80">
                {movie.Plot || "No description available."}
              </p>

              {/* Director */}
              {movie.Director && movie.Director !== "N/A" && (
                <div className="mt-0 flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Director
                  </p>
                  <p className="text-sm text-slate-300 dark:text-white/80">
                    {movie.Director}
                  </p>
                </div>
              )}

              {/* Cast */}
              {movie.Actors && movie.Actors !== "N/A" && (
                <div className="mt-0 flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Cast
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300 dark:text-white/80">
                    {movie.Actors}
                  </p>
                </div>
              )}
              
              {/* Guest: Sign in prompt */}
              {!user && (
                <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 transition-all duration-300">
                  <p className="text-sm text-white/90">
                    Want to save this movie to your Watchlist or mark it as Watched? Sign in to start tracking your movies!
                  </p>
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="mt-3 w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-red-500"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Logged-in: Full controls */}
              {user && (
                <>
                  {/* Watchlist Section */}
                  <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      Watch list
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={onToggleWatchlist}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition duration-200 ${
                          isInWatchList
                            ? "border border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : "border border-white/20 text-white/80 hover:border-red-500 hover:text-white"
                        }`}
                      >
                        {isInWatchList ? "✓ In Watch list" : "Add to Watch list"}
                      </button>
                      {isInWatchList && (
                        <PlaylistPicker
                          imdbID={movie.imdbID}
                          playlists={watchlistPlaylists}
                          getPlaylistsContaining={(id) => getPlaylistsContaining(id, "watchlist")}
                          isMovieInPlaylist={(pId, id) => isMovieInPlaylist(pId, id, "watchlist")}
                          addMovieToPlaylist={(pId, id) => addMovieToPlaylist(pId, id, "watchlist")}
                          removeMovieFromPlaylist={(pId, id) => removeMovieFromPlaylist(pId, id, "watchlist")}
                          createPlaylist={(name) => createPlaylist(name, "watchlist")}
                          renamePlaylist={(pId, name) => renamePlaylist(pId, name, "watchlist")}
                          deletePlaylist={(pId) => deletePlaylist(pId, "watchlist")}
                          label="Playlists"
                        />
                      )}
                    </div>
                  </div>

                  {/* Watched Section */}
                  <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      Watched
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={onToggleWatched}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition duration-200 ${
                          isWatched
                            ? "border border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : "border border-white/20 text-white/80 hover:border-red-500 hover:text-white"
                        }`}
                      >
                        {isWatched ? "✓ Watched" : "Mark as Watched"}
                      </button>
                      {isWatched && (
                        <PlaylistPicker
                          imdbID={movie.imdbID}
                          playlists={watchedPlaylists}
                          getPlaylistsContaining={(id) => getPlaylistsContaining(id, "watched")}
                          isMovieInPlaylist={(pId, id) => isMovieInPlaylist(pId, id, "watched")}
                          addMovieToPlaylist={(pId, id) => addMovieToPlaylist(pId, id, "watched")}
                          removeMovieFromPlaylist={(pId, id) => removeMovieFromPlaylist(pId, id, "watched")}
                          createPlaylist={(name) => createPlaylist(name, "watched")}
                          renamePlaylist={(pId, name) => renamePlaylist(pId, name, "watched")}
                          deletePlaylist={(pId) => deletePlaylist(pId, "watched")}
                          label="Playlists"
                        />
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Additional Action Buttons */}
              {user && actionButtons && actionButtons.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                  {actionButtons.map((button, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={button.onClick}
                      className={button.className || "rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition duration-200 hover:border-red-500 hover:text-white"}
                    >
                      {button.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
