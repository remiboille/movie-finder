"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Movie, Person, posterUrl } from "@/lib/tmdb";

type SearchMode = "title" | "director";

export default function SearchForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<SearchMode>((params.get("type") as SearchMode) ?? "title");
  const [inputValue, setInputValue] = useState(params.get("q") ?? "");
  const [movieSuggestions, setMovieSuggestions] = useState<Movie[]>([]);
  const [personSuggestions, setPersonSuggestions] = useState<Person[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.trim().length < 2) {
      setMovieSuggestions([]);
      setPersonSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(inputValue)}&type=${mode}`);
        const data = await res.json();
        if (mode === "director") {
          setPersonSuggestions(data);
          setMovieSuggestions([]);
          setShowDropdown(data.length > 0);
        } else {
          setMovieSuggestions(data);
          setPersonSuggestions([]);
          setShowDropdown(data.length > 0);
        }
      } finally {
        setLoading(false);
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [inputValue, mode]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleModeChange(newMode: SearchMode) {
    setMode(newMode);
    setInputValue("");
    setShowDropdown(false);
    setMovieSuggestions([]);
    setPersonSuggestions([]);
  }

  function submit(query: string, searchMode: SearchMode) {
    setShowDropdown(false);
    const url = searchMode === "director"
      ? `/?q=${encodeURIComponent(query)}&type=director`
      : `/?q=${encodeURIComponent(query)}`;
    startTransition(() => router.push(url));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim()) return;
    submit(inputValue.trim(), mode);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl flex flex-col gap-3">
      {/* Mode toggle */}
      <div className="flex gap-0" style={{ border: "1px solid var(--border)" }}>
        {(["title", "director"] as SearchMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className="flex-1 py-2 text-xs uppercase tracking-widest transition-all duration-200"
            style={{
              background: mode === m ? "var(--red)" : "transparent",
              color: mode === m ? "var(--cream)" : "var(--text-dim)",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.1em",
            }}
          >
            {m === "title" ? "By Title" : "By Director"}
          </button>
        ))}
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => (movieSuggestions.length > 0 || personSuggestions.length > 0) && setShowDropdown(true)}
            onKeyDown={(e) => e.key === "Escape" && setShowDropdown(false)}
            type="search"
            placeholder={
              mode === "director"
                ? "Name a director, Diane…"
                : "Diane, I am entering a film into the archive…"
            }
            className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              background: "var(--surface)",
              border: `1px solid ${showDropdown ? "var(--red)" : "var(--border)"}`,
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
          className="link-red-hover px-5 py-3 text-xs uppercase tracking-widest disabled:opacity-40 whitespace-nowrap"
          style={{
            background: "transparent",
            color: "var(--cream)",
            border: "1px solid var(--red)",
            fontFamily: "var(--font-body)",
            letterSpacing: "0.1em",
          }}
        >
          {isPending ? "…" : "Search"}
        </button>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 z-50 overflow-hidden"
          style={{
            marginTop: "2px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {mode === "title" && movieSuggestions.map((movie) => {
            const thumb = posterUrl(movie.poster_path, "w300");
            const year = movie.release_date?.slice(0, 4) ?? "—";
            return (
              <button
                key={movie.id}
                onClick={() => { setInputValue(movie.title); submit(movie.title, "title"); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors duration-150"
                style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="flex-none w-8 h-12 relative overflow-hidden" style={{ background: "var(--surface2)" }}>
                  {thumb && (
                    <Image src={thumb} alt={movie.title} fill className="object-cover" sizes="32px" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate italic" style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}>
                    {movie.title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                    {year}{movie.vote_average > 0 && ` · ★ ${movie.vote_average.toFixed(1)}`}
                  </p>
                </div>
              </button>
            );
          })}

          {mode === "director" && personSuggestions.map((person) => (
            <button
              key={person.id}
              onClick={() => { setInputValue(person.name); submit(person.name, "director"); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150"
              style={{ borderBottom: "1px solid var(--border)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <p className="text-sm" style={{ color: "var(--cream)", fontFamily: "var(--font-body)" }}>
                {person.name}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
