"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useWatchlist } from "../../context/WatchlistContext";
import MoviePosterCard from "../../components/MoviePosterCard";
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
    <div className="feelvie-page relative min-h-screen">
      <div className="feelvie-ambient" aria-hidden>
        <div className="feelvie-ambient-spot feelvie-ambient-spot-1" />
        <div className="feelvie-ambient-spot feelvie-ambient-spot-2" />
        <div className="feelvie-grid" />
      </div>
      
      <div className="relative z-10 mx-auto w-[min(1280px,100%)] px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <h1 className="feelvie-title text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
              Watch list
            </h1>
            <p className="text-xs sm:text-sm text-white/70">Movies you plan to watch</p>
          </div>
          <Link
            href="/"
            className="feelvie-button inline-flex items-center justify-center rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white w-full sm:w-auto transition-all duration-300 ease-out hover:scale-105 active:scale-95"
          >
            Back to home
          </Link>
        </div>

      <div className="mt-4 sm:mt-6">
        <PlaylistCategories
          playlists={watchlistPlaylists}
          activePlaylistId={activePlaylistId}
          onSelectPlaylist={setActivePlaylistId}
          onDeletePlaylist={(id) => {
            deletePlaylist(id, "watchlist");
            if (activePlaylistId === id) setActivePlaylistId(null);
          }}
          onRenamePlaylist={(id, newName) => renamePlaylist(id, newName, "watchlist")}
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
        <div className="feelvie-card mt-6 sm:mt-8 p-6 sm:p-8 text-center transition-all duration-300 ease-out">
          <p className="text-sm sm:text-base text-white/70">
            No movies in your watch list. Add some from the home page.
          </p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="feelvie-card mt-6 sm:mt-8 p-6 sm:p-8 text-center transition-all duration-300 ease-out">
          <p className="text-sm sm:text-base text-white/70">
            No movies in this category. Add movies from your list using &quot;Add to playlist&quot; on a movie.
          </p>
        </div>
      ) : (
        <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredList.map((movie) => (
            <MoviePosterCard
              key={movie.imdbID}
              movie={movie}
              onClick={() => setSelectedMovie(movie)}
            />
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
    </div>
  );
}
