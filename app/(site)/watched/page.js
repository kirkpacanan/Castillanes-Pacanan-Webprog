"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useWatchlist } from "../../context/WatchlistContext";
import PosterPlaceholder from "../../components/PosterPlaceholder";

export default function WatchedPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const { watched, watchList, addToWatchList } = useWatchlist();

  useEffect(() => {
    if (hydrated && !user) router.replace("/signin");
  }, [user, hydrated, router]);

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  const featured = watched[0];

  return (
    <div className="mx-auto w-[min(1280px,94%)] px-4 py-12 md:py-16">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Watched
      </h1>
      {watched.length === 0 ? (
        <p className="mt-6 text-slate-600 dark:text-white/70">
          You haven&apos;t marked any movies as watched yet.
        </p>
      ) : (
        <>
          {featured && (
            <div className="mt-8 glass rounded-2xl p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-500 dark:text-red-400">
                {featured.Genre}
              </p>
              <div className="mt-4 grid gap-6 md:grid-cols-[0.35fr_0.65fr]">
                <div className="overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                  {featured.Poster && featured.Poster !== "N/A" ? (
                    <img
                      src={featured.Poster}
                      alt={featured.Title}
                      className="h-full w-full rounded-xl object-contain"
                    />
                  ) : (
                    <PosterPlaceholder className="aspect-[2/3] w-full" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {featured.Title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
                    {featured.Year} · {featured.Runtime} · ⭐ {featured.imdbRating}
                  </p>
                  <p className="mt-4 text-sm text-slate-600 dark:text-white/75">
                    {featured.Plot}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => addToWatchList(featured)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 dark:border-white/20 dark:text-white/80"
                    >
                      Add to Watch list
                    </button>
                    <span className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400">
                      Watched
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              All watched
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {watched.map((movie) => (
                <div
                  key={movie.imdbID}
                  className="glass rounded-2xl overflow-hidden"
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
                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {movie.Title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-white/50">
                      {movie.Year} · ⭐ {movie.imdbRating}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500"
      >
        Back to Home
      </Link>
    </div>
  );
}
