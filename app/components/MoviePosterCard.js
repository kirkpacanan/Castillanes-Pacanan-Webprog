"use client";

import PosterPlaceholder from "./PosterPlaceholder";

export default function MoviePosterCard({ movie, onClick, className = "" }) {
  const year = movie?.Year || "—";
  const runtime = movie?.Runtime && movie.Runtime !== "N/A" ? movie.Runtime : "N/A";
  const rating =
    movie?.imdbRating && movie.imdbRating !== "N/A"
      ? `⭐ ${movie.imdbRating}`
      : "⭐ N/A";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left shadow-lg transition-all duration-300 ease-out hover:scale-[1.08] hover:shadow-[0_8px_24px_rgba(178,34,34,0.4)] hover:border-red-500/50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/40 ${className}`}
    >
      <div className="flex aspect-[2/3] w-full items-center justify-center bg-slate-100 dark:bg-white/5">
        {movie?.Poster && movie.Poster !== "N/A" ? (
          <img
            src={movie.Poster}
            alt={movie?.Title || "Movie poster"}
            className="h-full w-full rounded-t-xl object-cover"
          />
        ) : (
          <PosterPlaceholder className="h-full w-full rounded-t-xl" />
        )}
      </div>
      <div className="space-y-1 px-3 py-3">
        <p
          className="text-sm font-semibold text-white/95 truncate group-hover:text-white"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          {movie?.Title || "Untitled"}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-white/70">
          <span>{year}</span>
          <span>• {runtime}</span>
          <span>• {rating}</span>
        </div>
      </div>
    </button>
  );
}
