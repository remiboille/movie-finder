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
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const { toggle, isFavorite } = useFavorites();
  const faved = isFavorite(movie.id);

  async function openTrailer() {
    setLoadingTrailer(true);
    try {
      const res = await fetch(`/api/trailer/${movie.id}`);
      const { url } = await res.json();
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " trailer")}`,
          "_blank",
          "noopener,noreferrer"
        );
      }
    } finally {
      setLoadingTrailer(false);
    }
  }

  return (
    <div
      onClick={openTrailer}
      className="group flex flex-col overflow-hidden transition-all duration-500 cursor-pointer"
      style={{
        background: "var(--surface)",
        border: `1px solid ${hovered ? "var(--red)" : "var(--border)"}`,
        boxShadow: hovered ? "var(--glow-red)" : "none",
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
            className="object-cover transition-all duration-500"
            style={{
              opacity: hovered ? 0.6 : 0.85,
              filter: hovered ? "sepia(30%) contrast(110%)" : "sepia(15%)",
            }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-xs chevron-bg"
            style={{ color: "var(--text-dim)" }}
          >
            No Signal
          </div>
        )}

        {/* Film grain on image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
          }}
        />

        {rating && (
          <span
            className="absolute top-2 left-2 text-xs px-2 py-0.5"
            style={{
              background: "rgba(13,5,5,0.9)",
              color: "var(--gold)",
              border: "1px solid var(--gold-dim)",
              fontFamily: "var(--font-display)",
              textShadow: "0 0 8px var(--gold)",
            }}
          >
            ★ {rating}
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggle(movie); }}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center transition-all duration-300"
          style={{
            background: "rgba(13,5,5,0.85)",
            border: `1px solid ${faved ? "var(--red)" : "var(--border)"}`,
            color: faved ? "var(--red)" : "var(--text-dim)",
            boxShadow: faved ? "var(--glow-red)" : "none",
            fontSize: "15px",
          }}
          title={faved ? "Remove from archive" : "Save to archive"}
        >
          {faved ? "♥" : "♡"}
        </button>

        {/* Play button */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full"
            style={{
              background: "rgba(13,5,5,0.85)",
              border: "2px solid var(--red)",
              boxShadow: "var(--glow-red)",
              color: "var(--cream)",
              fontSize: "18px",
            }}
          >
            {loadingTrailer ? "…" : "▶"}
          </div>
        </div>

        {/* Synopsis overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-3 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(13,5,5,0.98) 40%, rgba(13,5,5,0.65) 100%)",
            opacity: hovered ? 1 : 0,
          }}
        >
          <p
            className="text-xs leading-relaxed line-clamp-6"
            style={{ color: "var(--cream)", fontFamily: "var(--font-body)" }}
          >
            {movie.overview || "The owls are not what they seem."}
          </p>
        </div>

        {/* Bottom fade (not hovered) */}
        <div
          className="absolute bottom-0 inset-x-0 h-10 pointer-events-none transition-opacity duration-500"
          style={{
            background: "linear-gradient(to top, var(--surface), transparent)",
            opacity: hovered ? 0 : 1,
          }}
        />
      </div>

      <div className="p-3 flex flex-col gap-1">
        <p
          className="text-xs font-bold leading-tight line-clamp-2"
          style={{ color: "var(--cream)", fontFamily: "var(--font-display)", fontStyle: "italic" }}
        >
          {movie.title}
        </p>
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>{year}</p>
      </div>
    </div>
  );
}
