import { Suspense } from "react";
import Link from "next/link";
import { searchMovies, getCultSciFi, getTopRated, getNewReleases, getHiddenGems } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import MovieRow from "@/components/MovieRow";
import SearchForm from "@/components/SearchForm";
import PersonalRecommendations from "@/components/PersonalRecommendations";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

async function SearchResults({ query, page }: { query: string; page: number }) {
  const data = await searchMovies(query, page);

  if (data.results.length === 0) {
    return (
      <p className="text-sm tracking-widest mt-8" style={{ color: "var(--text-dim)" }}>
        NO MATCHING RECORDS FOR &ldquo;{query.toUpperCase()}&rdquo;
      </p>
    );
  }

  return (
    <div className="w-full">
      <p className="text-xs tracking-widest mb-6" style={{ color: "var(--text-dim)" }}>
        <span style={{ color: "var(--cyan)" }}>{data.results.length}</span> RECORDS RETRIEVED
        &nbsp;/&nbsp; QUERY: <span style={{ color: "var(--cyan)" }}>{query.toUpperCase()}</span>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {data.results.map((movie) => (
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
      <MovieRow title="CULT &amp; AVANT-GARDE" subtitle="CLASSIFIED TRANSMISSIONS" movies={cult} accentColor="magenta" />
      <MovieRow title="TOP RATED" subtitle="HIGHEST RANKED IN THE ARCHIVE" movies={topRated} accentColor="cyan" />
      <MovieRow title="NEW RELEASES" subtitle="RECENT SIGNALS DETECTED" movies={newReleases} accentColor="amber" />
      <MovieRow title="HIDDEN GEMS" subtitle="LOW PROFILE — HIGH VALUE" movies={hiddenGems} accentColor="cyan" />
    </div>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const { q, page } = await searchParams;
  const query = q?.trim() ?? "";
  const currentPage = Number(page) || 1;

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
          SCI-FI FINDER
        </h1>
        <p className="text-xs tracking-[0.3em]" style={{ color: "var(--text-dim)" }}>
          CLASSIFIED DATABASE &mdash; GENRE 878 &mdash; AUTHORIZED ACCESS ONLY
        </p>

        <div className="flex items-center gap-3 w-full max-w-md mt-1">
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span className="text-xs tracking-widest" style={{ color: "var(--cyan)" }}>◈</span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>

        <Link
          href="/favorites"
          className="text-xs tracking-widest px-4 py-1.5 transition-all duration-200 mt-1"
          style={{
            color: "var(--magenta)",
            border: "1px solid var(--magenta)",
            boxShadow: "var(--glow-magenta)",
            fontFamily: "var(--font-display)",
          }}
        >
          ♥ MY ARCHIVE
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
            <p className="text-xs tracking-widest animate-pulse mt-8" style={{ color: "var(--cyan)" }}>
              SCANNING DATABASE…
            </p>
          }
        >
          <SearchResults query={query} page={currentPage} />
        </Suspense>
      ) : (
        <Suspense
          fallback={
            <p className="text-xs tracking-widest animate-pulse mt-8" style={{ color: "var(--cyan)" }}>
              LOADING TRANSMISSIONS…
            </p>
          }
        >
          <Homepage />
        </Suspense>
      )}
    </main>
  );
}
