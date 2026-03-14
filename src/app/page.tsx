import { Suspense } from "react";
import Link from "next/link";
import {
  searchMovies,
  searchByDirector,
  getCultSciFi,
  getTopRated,
  getNewReleases,
  getHiddenGems,
} from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import MovieRow from "@/components/MovieRow";
import SearchForm from "@/components/SearchForm";
import PersonalRecommendations from "@/components/PersonalRecommendations";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string; type?: string }>;
}

async function SearchResults({ query, page, type }: { query: string; page: number; type: string }) {
  const isDirector = type === "director";

  let movies;
  let total: number;

  if (isDirector) {
    movies = await searchByDirector(query);
    total = movies.length;
  } else {
    const data = await searchMovies(query, page);
    movies = data.results;
    total = movies.length;
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 mt-16">
        <p className="text-base italic" style={{ fontFamily: "var(--font-display)", color: "var(--text-dim)" }}>
          The owls found nothing.
        </p>
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
          No records for &ldquo;{query}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-xs mb-6" style={{ color: "var(--text-dim)" }}>
        <span style={{ color: "var(--gold)" }}>{total}</span>{" "}
        {isDirector ? (
          <>sci-fi films directed by <span style={{ color: "var(--cream)" }}>{query}</span></>
        ) : (
          <>records found for &ldquo;{query}&rdquo;</>
        )}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

async function Homepage() {
  const [cult, topRated, newReleases, hiddenGems] = await Promise.all([
    getCultSciFi(),
    getTopRated(),
    getNewReleases(),
    getHiddenGems(),
  ]);

  return (
    <div className="w-full flex flex-col gap-12">
      <PersonalRecommendations />
      <MovieRow title="Fire Walk With Me" subtitle="Cult & avant-garde transmissions" movies={cult} accentColor="red" />
      <MovieRow title="The Log Has Spoken" subtitle="Highest rated in the archive" movies={topRated} accentColor="gold" />
      <MovieRow title="New Signals" subtitle="Recent arrivals from beyond" movies={newReleases} accentColor="gold" />
      <MovieRow title="The Owls Know" subtitle="Hidden gems, low profile — high value" movies={hiddenGems} accentColor="red" />
    </div>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const { q, page, type } = await searchParams;
  const query = q?.trim() ?? "";
  const currentPage = Number(page) || 1;
  const searchType = type ?? "title";

  return (
    <main className="min-h-screen px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center gap-10 max-w-screen-xl mx-auto">

      {/* Header */}
      <div className="text-center flex flex-col items-center gap-3 w-full">
        <p className="text-xs tracking-widest uppercase" style={{ color: "var(--text-dim)" }}>
          The owls are not what they seem
        </p>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black italic leading-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
        >
          The Black Lodge
        </h1>

        <p className="text-sm italic" style={{ color: "var(--text-dim)", fontFamily: "var(--font-display)" }}>
          A damn fine archive of cult & avant-garde sci-fi cinema
        </p>

        <div className="curtain-divider w-full max-w-xs sm:max-w-md mt-2" />

        <Link
          href="/favorites"
          className="link-red-hover text-xs uppercase tracking-widest px-5 py-2 mt-1"
          style={{
            color: "var(--text-dim)",
            border: "1px solid var(--border)",
            letterSpacing: "0.1em",
          }}
        >
          ♥ My Archive
        </Link>
      </div>

      {/* Search */}
      <Suspense>
        <SearchForm />
      </Suspense>

      {/* Content */}
      {query ? (
        <Suspense
          fallback={
            <p className="text-sm italic mt-8 animate-pulse" style={{ color: "var(--text-dim)", fontFamily: "var(--font-display)" }}>
              The owls are searching…
            </p>
          }
        >
          <SearchResults query={query} page={currentPage} type={searchType} />
        </Suspense>
      ) : (
        <Suspense
          fallback={
            <p className="text-sm italic mt-8 animate-pulse" style={{ color: "var(--text-dim)", fontFamily: "var(--font-display)" }}>
              Entering the lodge…
            </p>
          }
        >
          <Homepage />
        </Suspense>
      )}
    </main>
  );
}
