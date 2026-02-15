"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useWatchlist } from "../../context/WatchlistContext";
import PosterPlaceholder from "../../components/PosterPlaceholder";

export default function WatchListPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const { watchList, removeFromWatchList, markWatched } = useWatchlist();
  const [selectedMovie, setSelectedMovie] = useState(null);

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

  return (
    <div className="mx-auto w-[min(1280px,94%)] px-4 py-12 md:py-16">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Watch List
      </h1>
      {watchList.length === 0 ? (
        <p className="mt-6 text-slate-600 dark:text-white/70">
          No movies in your watch list. Add some from the home page.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {watchList.map((movie) => (
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
      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500"
      >
        Back to Home
      </Link>

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
                  <div className="mt-4 flex flex-wrap gap-2">
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
