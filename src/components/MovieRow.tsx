import { Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  accentColor?: "cyan" | "magenta" | "amber";
}

export default function MovieRow({
  title,
  subtitle,
  movies,
  accentColor = "cyan",
}: MovieRowProps) {
  if (movies.length === 0) return null;

  const color =
    accentColor === "magenta"
      ? "var(--magenta)"
      : accentColor === "amber"
      ? "var(--amber)"
      : "var(--cyan)";

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h2
          className="text-sm font-bold tracking-widest"
          style={{ fontFamily: "var(--font-display)", color }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs tracking-widest" style={{ color: "var(--text-dim)" }}>
            {subtitle}
          </p>
        )}
        <div className="h-px mt-2" style={{ background: `linear-gradient(to right, ${color}44, transparent)` }} />
      </div>

      <div
        className="flex gap-4 overflow-x-auto pb-3"
        style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none w-36 sm:w-44">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
