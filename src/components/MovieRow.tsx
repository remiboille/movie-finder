import { Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  accentColor?: "red" | "gold";
}

export default function MovieRow({ title, subtitle, movies, accentColor = "gold" }: MovieRowProps) {
  if (movies.length === 0) return null;
  const color = accentColor === "red" ? "var(--red)" : "var(--gold)";

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex items-baseline gap-3 border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <h2
          className="text-sm font-bold italic"
          style={{ fontFamily: "var(--font-display)", color }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            {subtitle}
          </p>
        )}
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" } as React.CSSProperties}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none w-28 sm:w-36 md:w-40">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
