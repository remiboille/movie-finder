import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = process.env.TMDB_API_TOKEN;

  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 86400 },
  });

  if (!res.ok) return NextResponse.json({ url: null });

  const data = await res.json();
  const videos: { site: string; type: string; key: string }[] = data.results ?? [];

  const trailer =
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    videos.find((v) => v.site === "YouTube");

  if (trailer) {
    return NextResponse.json({ url: `https://www.youtube.com/watch?v=${trailer.key}` });
  }

  return NextResponse.json({ url: null });
}
