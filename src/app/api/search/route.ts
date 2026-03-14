import { NextResponse } from "next/server";
import { searchMovies, searchPersonSuggestions } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "title";

  if (q.trim().length < 2) return NextResponse.json([]);

  if (type === "director") {
    const people = await searchPersonSuggestions(q);
    return NextResponse.json(people);
  }

  const data = await searchMovies(q);
  return NextResponse.json(data.results.slice(0, 6));
}
