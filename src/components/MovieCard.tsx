"use client";

import Image from "next/image";
import { useState } from "react";
import { Movie, posterUrl } from "@/lib/tmdb";
import { useFavorites } from "@/hooks/useFavorites";

export default function MovieCard({ movie }: { movie: Movie }) {
  const poster = posterUrl(movie.poster_path, "w300");
  const year = movie.release_date?.slice(0, 4) ?? "—";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const [hovered, setHovered] = useState(false);
  const { toggle, isFavorite } = useFavorites();
  const faved = isFavorite(movie.id);

  return (
    <div
      className="group flex flex-col overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        background: "var(--surface)",
        border: `1px solid ${hovered ? "var(--cyan)" : "var(--border)"}`,
        boxShadow: hovered ? "var(--glow-cyan)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[2/3]" style={{ background: "var(--surface2)" }}>
        {poster ? (
          <Image
            src={poster}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-xs tracking-widest"
            style={{ color: "var(--text-dim)" }}
          >
            NO SIGNAL
          </div>
        )}

        {/* Scanline overlay on image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 3px)",
          }}
        />

        {rating && (
          <span
            className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 tracking-wider"
            style={{
              background: "rgba(0,0,0,0.85)",
              color: "var(--amber)",
              border: "1px solid var(--amber)",
              textShadow: "0 0 8px var(--amber)",
            }}
          >
            ★ {rating}
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggle(movie);
          }}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center transition-all duration-200"
          style={{
            background: "rgba(0,0,0,0.75)",
            border: `1px solid ${faved ? "var(--magenta)" : "var(--border)"}`,
            color: faved ? "var(--magenta)" : "var(--text-dim)",
            boxShadow: faved ? "var(--glow-magenta)" : "none",
            fontSize: "14px",
          }}
          title={faved ? "Remove from favorites" : "Add to favorites"}
        >
          {faved ? "♥" : "♡"}
        </button>

        {/* Synopsis overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-3 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(4,5,13,0.97) 40%, rgba(4,5,13,0.7) 100%)",
            opacity: hovered ? 1 : 0,
          }}
        >
          <p
            className="text-xs leading-relaxed line-clamp-6 tracking-wide"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
          >
            {movie.overview || "NO DATA AVAILABLE."}
          </p>
        </div>

        {/* Bottom gradient (shown when not hovered) */}
        <div
          className="absolute bottom-0 inset-x-0 h-12 pointer-events-none transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, var(--surface), transparent)",
            opacity: hovered ? 0 : 1,
          }}
        />
      </div>

      <div className="p-3 flex flex-col gap-1">
        <p
          className="text-xs font-bold leading-tight line-clamp-2 tracking-wide"
          style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}
        >
          {movie.title}
        </p>
        <p className="text-xs tracking-widest" style={{ color: "var(--text-dim)" }}>
          {year}
        </p>
      </div>
    </div>
  );
}
