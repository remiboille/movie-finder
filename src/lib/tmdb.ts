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

async function discover(params: Record<string, string>, revalidate = 3600): Promise<Movie[]> {
  const url = new URL(`${BASE_URL}/discover/movie`);
  url.searchParams.set("with_genres", String(SCIFI_GENRE_ID));
  url.searchParams.set("include_adult", "false");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: authHeaders(),
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  const data: SearchResponse = await res.json();
  return data.results;
}

export async function searchMovies(query: string, page = 1): Promise<SearchResponse> {
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
  return {
    ...data,
    results: data.results.filter((m) => m.genre_ids.includes(SCIFI_GENRE_ID)),
  };
}

// TMDB keyword IDs: 9840 = cult film, 10084 = avant-garde
export async function getCultSciFi(): Promise<Movie[]> {
  return discover({
    with_keywords: "9840,10084",
    sort_by: "vote_average.desc",
    "vote_count.gte": "150",
  });
}

export async function getTopRated(): Promise<Movie[]> {
  return discover({
    sort_by: "vote_average.desc",
    "vote_count.gte": "500",
  });
}

export async function getNewReleases(): Promise<Movie[]> {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 2);
  return discover({
    sort_by: "popularity.desc",
    "primary_release_date.gte": cutoff.toISOString().slice(0, 10),
  }, 3600);
}

export async function getHiddenGems(): Promise<Movie[]> {
  return discover({
    sort_by: "vote_average.desc",
    "vote_average.gte": "7.0",
    "vote_count.gte": "50",
    "vote_count.lte": "800",
    "popularity.lte": "20",
  });
}

export async function getRecommendations(movieId: number): Promise<Movie[]> {
  const url = `${BASE_URL}/movie/${movieId}/recommendations`;
  const res = await fetch(url, {
    headers: authHeaders(),
    next: { revalidate: 86400 },
  });
  if (!res.ok) return [];
  const data: SearchResponse = await res.json();
  return data.results.filter((m) => m.genre_ids.includes(SCIFI_GENRE_ID));
}

export function posterUrl(path: string | null, size: "w300" | "w500" | "original" = "w300") {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export interface Person {
  id: number;
  name: string;
  known_for_department: string;
}

export async function searchPersonSuggestions(query: string): Promise<Person[]> {
  const url = new URL(`${BASE_URL}/search/person`);
  url.searchParams.set("query", query);
  url.searchParams.set("include_adult", "false");

  const res = await fetch(url.toString(), {
    headers: authHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results as Person[])
    .filter((p) => p.known_for_department === "Directing")
    .slice(0, 6);
}

export async function searchByDirector(name: string): Promise<Movie[]> {
  const personUrl = new URL(`${BASE_URL}/search/person`);
  personUrl.searchParams.set("query", name);
  personUrl.searchParams.set("include_adult", "false");

  const personRes = await fetch(personUrl.toString(), {
    headers: authHeaders(),
    next: { revalidate: 3600 },
  });
  if (!personRes.ok) return [];
  const personData = await personRes.json();
  if (!personData.results?.length) return [];

  const person = personData.results[0];

  const creditsRes = await fetch(`${BASE_URL}/person/${person.id}/movie_credits`, {
    headers: authHeaders(),
    next: { revalidate: 3600 },
  });
  if (!creditsRes.ok) return [];
  const creditsData = await creditsRes.json();

  return (creditsData.crew as (Movie & { job: string })[])
    .filter((c) => c.job === "Director" && c.genre_ids?.includes(SCIFI_GENRE_ID))
    .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0));
}
