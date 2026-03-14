"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Movie, posterUrl } from "@/lib/tmdb";

export default function SearchForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(params.get("q") ?? "");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced predictive search
  useEffect(() => {
    if (inputValue.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(inputValue)}`);
        const movies: Movie[] = await res.json();
        setSuggestions(movies);
        setShowDropdown(movies.length > 0);
      } finally {
        setLoading(false);
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setShowDropdown(false);
    startTransition(() => router.push(`/?q=${encodeURIComponent(inputValue.trim())}`));
  }

  function handleSuggestionClick(movie: Movie) {
    setInputValue(movie.title);
    setShowDropdown(false);
    startTransition(() => router.push(`/?q=${encodeURIComponent(movie.title)}`));
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            onKeyDown={(e) => e.key === "Escape" && setShowDropdown(false)}
            type="search"
            placeholder="Diane, I am entering a film into the archive…"
            className="w-full px-4 py-3 text-sm outline-none transition-all duration-300"
            style={{
              background: "var(--surface)",
              border: `1px solid ${showDropdown ? "var(--gold)" : "var(--border)"}`,
              boxShadow: showDropdown ? "var(--glow-gold)" : "none",
              color: "var(--cream)",
              fontFamily: "var(--font-body)",
            }}
          />
          {loading && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs animate-pulse"
              style={{ color: "var(--text-dim)" }}
            >
              …
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="link-red-hover px-6 py-3 text-sm disabled:opacity-40 whitespace-nowrap"
          style={{
            background: "transparent",
            color: "var(--cream)",
            border: "1px solid var(--red)",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
          }}
        >
          {isPending ? "Walking with fire…" : "Enter the Lodge"}
        </button>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--gold-dim)",
            boxShadow: "var(--glow-gold)",
          }}
        >
          {suggestions.map((movie) => {
            const thumb = posterUrl(movie.poster_path, "w300");
            const year = movie.release_date?.slice(0, 4) ?? "—";
            return (
              <button
                key={movie.id}
                onClick={() => handleSuggestionClick(movie)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors duration-150"
                style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div
                  className="flex-none w-8 h-12 relative overflow-hidden"
                  style={{ background: "var(--surface2)" }}
                >
                  {thumb && (
                    <Image src={thumb} alt={movie.title} fill className="object-cover" sizes="32px" style={{ filter: "sepia(20%)" }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm truncate italic"
                    style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
                  >
                    {movie.title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                    {year}
                    {movie.vote_average > 0 && ` · ★ ${movie.vote_average.toFixed(1)}`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
