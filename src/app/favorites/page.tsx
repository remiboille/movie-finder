"use client";

import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import MovieCard from "@/components/MovieCard";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <main className="min-h-screen px-6 py-12 flex flex-col items-center gap-10 max-w-screen-xl mx-auto">

      {/* Header */}
      <div className="text-center flex flex-col items-center gap-3 w-full">
        <p
          className="text-xs tracking-[0.4em]"
          style={{ color: "var(--magenta)", textShadow: "var(--glow-magenta)" }}
        >
          NEXUS CORP // ARCHIVE DIVISION
        </p>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--cyan)",
            textShadow: "var(--glow-cyan)",
          }}
        >
          FAVORITES
        </h1>
        <p className="text-xs tracking-[0.3em]" style={{ color: "var(--text-dim)" }}>
          PERSONAL ARCHIVE &mdash; LOCAL STORAGE &mdash; ENCRYPTED
        </p>

        <div className="flex items-center gap-3 w-full max-w-md mt-1">
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span className="text-xs tracking-widest" style={{ color: "var(--cyan)" }}>◈</span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>

        <Link
          href="/"
          className="text-xs tracking-widest transition-colors duration-200 mt-1"
          style={{ color: "var(--text-dim)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
        >
          ← BACK TO DATABASE
        </Link>
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-4 mt-16">
          <p
            className="text-4xl"
            style={{ color: "var(--border)", textShadow: "none" }}
          >
            ♡
          </p>
          <p className="text-xs tracking-widest" style={{ color: "var(--text-dim)" }}>
            NO RECORDS SAVED YET
          </p>
          <p className="text-xs tracking-widest" style={{ color: "var(--text-dim)" }}>
            PRESS ♡ ON ANY FILM TO ARCHIVE IT
          </p>
        </div>
      ) : (
        <div className="w-full">
          <p className="text-xs tracking-widest mb-6" style={{ color: "var(--text-dim)" }}>
            <span style={{ color: "var(--magenta)" }}>{favorites.length}</span> ARCHIVED RECORD{favorites.length !== 1 ? "S" : ""}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
