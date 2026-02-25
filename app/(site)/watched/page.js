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

export default function WatchedPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const {
    watched,
    addToWatchList,
    removeFromWatchList,
    markUnwatched,
    watchedPlaylists,
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

  const filteredWatched = activePlaylistId
    ? watched.filter((m) => isMovieInPlaylist(activePlaylistId, m.imdbID, "watched"))
    : watched;

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
              Watched
            </h1>
            <p className="text-xs sm:text-sm text-white/70">Your watched movies collection</p>
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
          playlists={watchedPlaylists}
          activePlaylistId={activePlaylistId}
          onSelectPlaylist={setActivePlaylistId}
          onDeletePlaylist={(id) => {
            deletePlaylist(id, "watched");
            if (activePlaylistId === id) setActivePlaylistId(null);
          }}
          onRenamePlaylist={(id, newName) => renamePlaylist(id, newName, "watched")}
          onCreatePlaylist={() => setCreateOpen(true)}
          items={watched}
        />
      </div>

      <CreatePlaylistModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(name, type) => createPlaylist(name, "watched")}
        type="watched"
      />

      {watched.length === 0 ? (
        <div className="feelvie-card mt-6 sm:mt-8 p-6 sm:p-8 text-center transition-all duration-300 ease-out">
          <p className="text-sm sm:text-base text-white/70">
            You haven&apos;t marked any movies as watched yet.
          </p>
        </div>
      ) : filteredWatched.length === 0 ? (
        <div className="feelvie-card mt-6 sm:mt-8 p-6 sm:p-8 text-center transition-all duration-300 ease-out">
          <p className="text-sm sm:text-base text-white/70">
            No movies in this category. Add watched movies to playlists using &quot;Playlists&quot; when you open a movie.
          </p>
        </div>
      ) : (
        <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredWatched.map((movie) => (
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
        watchlistPlaylists={[]}
        watchedPlaylists={watchedPlaylists}
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
            if (isInWatchList(selectedMovie.imdbID)) {
              removeFromWatchList(selectedMovie.imdbID);
            } else {
              addToWatchList(selectedMovie);
            }
            setSelectedMovie(null);
          }
        }}
        onToggleWatched={() => {
          if (selectedMovie) {
            markUnwatched(selectedMovie);
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
