"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useRef } from "react";

export default function SearchForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (!q) return;
    startTransition(() => {
      router.push(`/?q=${encodeURIComponent(q)}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl px-0">
      <input
        ref={inputRef}
        defaultValue={params.get("q") ?? ""}
        type="search"
        placeholder="Diane, I am entering a film into the archive…"
        className="flex-1 px-4 py-3 text-sm outline-none transition-all duration-300"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--cream)",
          fontFamily: "var(--font-body)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--gold)";
          e.currentTarget.style.boxShadow = "var(--glow-gold)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-3 text-sm transition-all duration-300 disabled:opacity-40 whitespace-nowrap"
        style={{
          background: isPending ? "transparent" : "var(--red)",
          color: "var(--cream)",
          border: "1px solid var(--red)",
          boxShadow: isPending ? "none" : "var(--glow-red)",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
        }}
      >
        {isPending ? "Walking with fire…" : "Enter the Lodge"}
      </button>
    </form>
  );
}
