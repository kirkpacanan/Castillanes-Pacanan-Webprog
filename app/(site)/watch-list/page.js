"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useWatchlist } from "../../context/WatchlistContext";
import PosterPlaceholder from "../../components/PosterPlaceholder";
import PlaylistPicker from "../../components/PlaylistPicker";
import PlaylistCategories from "../../components/PlaylistCategories";
import MovieModal from "../../components/MovieModal";
import CreatePlaylistModal from "../../components/CreatePlaylistModal";

export default function WatchListPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const {
    watchList,
    removeFromWatchList,
    markWatched,
    watchlistPlaylists,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
    addMovieToPlaylist,
    removeMovieFromPlaylist,
    isMovieInPlaylist,
    getPlaylistsContaining,
    isInWatchList,
    isWatched,
  } = useWatchlist();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

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

  const filteredList = activePlaylistId
    ? watchList.filter((m) => isMovieInPlaylist(activePlaylistId, m.imdbID, "watchlist"))
    : watchList;

  return (
    <div className="mx-auto w-[min(1280px,94%)] px-4 py-12 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">
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
          playlists={watchlistPlaylists}
          activePlaylistId={activePlaylistId}
          onSelectPlaylist={setActivePlaylistId}
          onDeletePlaylist={(id) => {
            deletePlaylist(id, "watchlist");
            if (activePlaylistId === id) setActivePlaylistId(null);
          }}
          onCreatePlaylist={() => setCreateOpen(true)}
          items={watchList}
        />
      </div>

      <CreatePlaylistModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(name, type) => createPlaylist(name, "watchlist")}
        type="watchlist"
      />

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
                <h2 className="font-semibold text-white line-clamp-2">
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

      {/* Movie detail modal - opens when poster is clicked */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        watchlistPlaylists={watchlistPlaylists}
        watchedPlaylists={[]}
        getPlaylistsContaining={getPlaylistsContaining}
        isMovieInPlaylist={isMovieInPlaylist}
        addMovieToPlaylist={addMovieToPlaylist}
        removeMovieFromPlaylist={removeMovieFromPlaylist}
        createPlaylist={createPlaylist}
        renamePlaylist={renamePlaylist}
        deletePlaylist={deletePlaylist}
        isInWatchList={selectedMovie ? isInWatchList(selectedMovie.imdbID) : false}
        isWatched={selectedMovie ? isWatched(selectedMovie.imdbID) : false}
        onToggleWatchlist={() => {
          if (selectedMovie) {
            removeFromWatchList(selectedMovie.imdbID);
            setSelectedMovie(null);
          }
        }}
        onToggleWatched={() => {
          if (selectedMovie) {
            markWatched(selectedMovie);
            setSelectedMovie(null);
          }
        }}
        user={user}
        onSignIn={() => router.push("/signin")}
      />
    </div>
  );
}
