# The Black Lodge — Movie Finder

A Twin Peaks-themed cult & avant-garde sci-fi cinema archive built with Next.js 16 + React 19 + Tailwind CSS 4.

## Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 + CSS custom properties (no config file — uses `@theme inline`)
- **Data**: TMDB API (The Movie Database) via server-side fetch with `next: { revalidate }` caching
- **State**: localStorage for favorites (`useFavorites` hook)
- **Deploy**: Netlify (via `@netlify/plugin-nextjs`)

## Project Structure

```
src/
  app/
    page.tsx              # Home page: search results or homepage rows
    layout.tsx            # Root layout with fonts
    globals.css           # Design tokens, film grain, vignette, utilities
    favorites/page.tsx    # Saved favorites page
    api/
      recommendations/    # Route handler: TMDB recommendations by movieId
      search/             # Route handler: movie search
      trailer/            # Route handler: YouTube trailer lookup
  components/
    MovieCard.tsx         # Poster card with favorite toggle
    MovieRow.tsx          # Horizontal scrollable row of cards
    SearchForm.tsx        # Client search input (updates URL params)
    PersonalRecommendations.tsx  # Client component using favorites for recs
  hooks/
    useFavorites.ts       # localStorage-backed favorites state
  lib/
    tmdb.ts               # All TMDB fetch functions + Movie/SearchResponse types
```

## Environment Variables

Requires a `.env.local` file:

```
TMDB_API_TOKEN=<your_tmdb_bearer_token>
```

## Commands

```bash
npm run dev    # Start dev server at localhost:3000
npm run build  # Production build
npm run lint   # ESLint
```

## Design System

The UI uses a dark Twin Peaks / Black Lodge aesthetic defined entirely in `globals.css` CSS custom properties:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0d0505` | Page background |
| `--red` | `#cc2200` | Accent, borders, glows |
| `--gold` | `#c8922a` | Secondary accent |
| `--cream` | `#e8d5b7` | Primary text |
| `--text-dim` | `#8b6355` | Muted text |

Utility classes: `.curtain-divider`, `.chevron-bg`, `.link-red-hover`, `.link-gold-hover`.

Fonts: a display font and body font loaded in `layout.tsx` via `next/font`.

## Key Patterns

- **Server components by default** — data fetching happens in server components/pages; client components are marked `"use client"` and kept minimal.
- **Search via URL params** — `SearchForm` pushes `?q=` to the URL; the page reads `searchParams` and renders a `<Suspense>`-wrapped `SearchResults` server component.
- **TMDB filtering** — all results are filtered to sci-fi genre ID `878`; search results apply this filter client-side after fetch.
- **Revalidation** — homepage rows revalidate every 3600s; new releases every 3600s; recommendations every 86400s.
- **Favorites** — stored in `localStorage` under key `scifi-favorites`, no server persistence.
