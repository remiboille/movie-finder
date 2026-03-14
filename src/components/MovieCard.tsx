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
      className="group flex flex-col overflow-hidden cursor-pointer"
      style={{
        background: "var(--surface)",
        border: `1px solid ${hovered ? "var(--red)" : "var(--border)"}`,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
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
            className="object-cover"
            style={{
              opacity: hovered ? 0.55 : 0.9,
              transition: "opacity 0.3s ease",
            }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-xs"
            style={{ color: "var(--text-dim)" }}
          >
            No Signal
          </div>
        )}

        {rating && (
          <span
            className="absolute top-2 left-2 text-xs px-1.5 py-0.5"
            style={{
              background: "rgba(10,4,4,0.9)",
              color: "var(--gold)",
              fontFamily: "var(--font-body)",
              fontSize: "10px",
            }}
          >
            ★ {rating}
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggle(movie); }}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center transition-all duration-200"
          style={{
            background: "rgba(10,4,4,0.85)",
            border: `1px solid ${faved ? "var(--red)" : "var(--border)"}`,
            color: faved ? "var(--red)" : "var(--text-dim)",
            fontSize: "12px",
          }}
          title={faved ? "Remove from archive" : "Save to archive"}
        >
          {faved ? "♥" : "♡"}
        </button>

        {/* Play button */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.2s ease" }}
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{
              background: "rgba(10,4,4,0.8)",
              border: "1px solid var(--red)",
              color: "var(--cream)",
              fontSize: "14px",
            }}
          >
            {loadingTrailer ? "…" : "▶"}
          </div>
        </div>

        {/* Synopsis overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-3 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(10,4,4,0.97) 35%, rgba(10,4,4,0.5) 100%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <p
            className="text-xs leading-relaxed line-clamp-6"
            style={{ color: "var(--cream)", fontFamily: "var(--font-body)" }}
          >
            {movie.overview || "The owls are not what they seem."}
          </p>
        </div>

        {/* Bottom fade (resting) */}
        <div
          className="absolute bottom-0 inset-x-0 h-8 pointer-events-none"
          style={{
            background: "linear-gradient(to top, var(--surface), transparent)",
            opacity: hovered ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>

      <div className="px-3 py-2 flex flex-col gap-0.5">
        <p
          className="text-xs font-semibold leading-tight line-clamp-2 italic"
          style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
        >
          {movie.title}
        </p>
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>{year}</p>
      </div>
    </div>
  );
}
