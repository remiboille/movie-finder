import { NextResponse } from "next/server";
import { getRecommendations } from "@/lib/tmdb";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movies = await getRecommendations(Number(id));
  return NextResponse.json(movies);
}
