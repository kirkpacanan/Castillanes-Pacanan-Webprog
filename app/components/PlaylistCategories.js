"use client";

/**
 * Shared playlist/categories section for Watch list and Watched pages.
 * @param {Object} props
 * @param {Array} props.playlists - List of { id, name, movieIds }
 * @param {string|null} props.activePlaylistId - Currently selected playlist id (null = All)
 * @param {Function} props.onSelectPlaylist - (id: string | null) => void
 * @param {Function} props.onDeletePlaylist - (id: string) => void
 * @param {Function} props.onCreatePlaylist - () => void
 * @param {Array} props.items - Current page items (watchList or watched) for count
 */
export default function PlaylistCategories({
  playlists,
  activePlaylistId,
  onSelectPlaylist,
  onDeletePlaylist,
  onCreatePlaylist,
  items = [],
}) {
  const countInPlaylist = (pl) => items.filter((m) => pl.movieIds.includes(m.imdbID)).length;

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-5 dark:border-white/10 dark:bg-slate-800/50 md:px-6 md:py-6"
      aria-label="Playlist categories"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Categories
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-white/50">
            Filter by playlist or create one to organize your movies.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreatePlaylist}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-red-500/60 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:border-red-500 hover:bg-red-500/10 dark:border-red-400/60 dark:bg-red-500/10 dark:text-red-400 dark:hover:border-red-400 dark:hover:bg-red-500/20"
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
          className={`rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
            activePlaylistId === null
              ? "bg-red-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:text-white/90 dark:hover:bg-slate-600"
          }`}
        >
          All
          <span className="ml-1.5 rounded-full bg-black/10 px-1.5 py-0.5 text-xs dark:bg-white/20">
            {items.length}
          </span>
        </button>
        {playlists.map((pl) => {
          const count = countInPlaylist(pl);
          const isActive = activePlaylistId === pl.id;
          return (
            <div
              key={pl.id}
              className={`inline-flex items-center gap-1 rounded-xl border transition focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900 ${
                isActive
                  ? "border-red-500/50 bg-red-600 text-white shadow-md"
                  : "border-slate-200 bg-white dark:border-white/10 dark:bg-slate-700 dark:text-white/90"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectPlaylist(pl.id)}
                className="rounded-l-xl pl-4 pr-2 py-2 text-left text-sm font-medium hover:opacity-90"
              >
                {pl.name}
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                    isActive ? "bg-white/20" : "bg-slate-200 dark:bg-white/20"
                  }`}
                >
                  {count}
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePlaylist(pl.id);
                  if (isActive) onSelectPlaylist(null);
                }}
                className={`rounded-r-xl p-2 transition ${
                  isActive
                    ? "hover:bg-white/20"
                    : "hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
                aria-label={`Delete playlist ${pl.name}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
