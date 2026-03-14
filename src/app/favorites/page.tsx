"use client";

import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import MovieCard from "@/components/MovieCard";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <main className="min-h-screen px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center gap-10 max-w-screen-xl mx-auto">

      <div className="text-center flex flex-col items-center gap-3 w-full">
        <p className="text-xs tracking-widest uppercase" style={{ color: "var(--text-dim)" }}>
          Personal archive
        </p>

        <h1
          className="text-4xl sm:text-5xl font-black italic"
          style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
        >
          My Lodge
        </h1>

        <p className="text-sm italic" style={{ color: "var(--text-dim)", fontFamily: "var(--font-display)" }}>
          Films that chose you
        </p>

        <div className="curtain-divider w-full max-w-xs sm:max-w-md mt-2" />

        <Link
          href="/"
          className="link-gold-hover text-xs uppercase tracking-widest mt-1"
          style={{ color: "var(--text-dim)", letterSpacing: "0.1em" }}
        >
          ← Back to the Lodge
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-3 mt-16">
          <p className="text-4xl" style={{ color: "var(--border)" }}>♡</p>
          <p
            className="text-base italic text-center"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-display)" }}
          >
            The archive is empty.
          </p>
          <p className="text-xs text-center" style={{ color: "var(--text-dim)" }}>
            Press ♡ on any film to save it here.
          </p>
        </div>
      ) : (
        <div className="w-full">
          <p className="text-xs mb-6" style={{ color: "var(--text-dim)" }}>
            <span style={{ color: "var(--gold)" }}>{favorites.length}</span> film{favorites.length !== 1 ? "s" : ""} in your lodge
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
