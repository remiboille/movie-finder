"use client";

import { useEffect, useState } from "react";
import { Movie } from "@/lib/tmdb";
import { useFavorites } from "@/hooks/useFavorites";
import MovieRow from "./MovieRow";

export default function PersonalRecommendations() {
  const { favorites } = useFavorites();
  const [recs, setRecs] = useState<Movie[]>([]);
  const [sourceName, setSourceName] = useState("");

  useEffect(() => {
    if (favorites.length === 0) return;
    const source = favorites[favorites.length - 1]; // most recently saved
    setSourceName(source.title);

    fetch(`/api/recommendations/${source.id}`)
      .then((r) => r.json())
      .then((movies: Movie[]) => setRecs(movies.slice(0, 20)))
      .catch(() => {});
  }, [favorites]);

  if (favorites.length === 0 || recs.length === 0) return null;

  return (
    <MovieRow
      title="BECAUSE YOU SAVED"
      subtitle={sourceName.toUpperCase()}
      movies={recs}
      accentColor="magenta"
    />
  );
}
