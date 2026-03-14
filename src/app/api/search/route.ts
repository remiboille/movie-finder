import { NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (q.trim().length < 2) return NextResponse.json([]);
  const data = await searchMovies(q);
  return NextResponse.json(data.results.slice(0, 6));
}
