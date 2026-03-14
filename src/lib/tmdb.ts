const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const SCIFI_GENRE_ID = 878;

function authHeaders() {
  const token = process.env.TMDB_API_TOKEN;
  if (!token) throw new Error("TMDB_API_TOKEN is not set in .env.local");
  return { Authorization: `Bearer ${token}` };
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function searchMovies(
  query: string,
  page = 1
): Promise<SearchResponse> {
  const url = new URL(`${BASE_URL}/search/movie`);
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("include_adult", "false");

  const res = await fetch(url.toString(), {
    headers: authHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  const data: SearchResponse = await res.json();

  // Filter to sci-fi only
  return {
    ...data,
    results: data.results.filter((m) => m.genre_ids.includes(SCIFI_GENRE_ID)),
  };
}

// TMDB keyword IDs: 9840 = cult film, 10084 = avant-garde
const CULT_KEYWORDS = "9840,10084";

export async function discoverSciFi(page = 1): Promise<SearchResponse> {
  const url = new URL(`${BASE_URL}/discover/movie`);
  url.searchParams.set("with_genres", String(SCIFI_GENRE_ID));
  url.searchParams.set("with_keywords", CULT_KEYWORDS);
  url.searchParams.set("sort_by", "vote_average.desc");
  url.searchParams.set("vote_count.gte", "150");
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("page", String(page));

  const res = await fetch(url.toString(), {
    headers: authHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export function posterUrl(
  path: string | null,
  size: "w300" | "w500" | "original" = "w300"
) {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}
