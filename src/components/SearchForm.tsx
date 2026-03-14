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
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-2xl">
      <div className="relative flex-1">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-xs tracking-widest pointer-events-none"
          style={{ color: "var(--cyan)", fontFamily: "var(--font-display)" }}
        >
          &gt;_
        </span>
        <input
          ref={inputRef}
          defaultValue={params.get("q") ?? ""}
          type="search"
          placeholder="SEARCH DESIGNATION..."
          className="w-full pl-10 pr-4 py-3 text-sm tracking-widest outline-none transition-all duration-200"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            fontFamily: "var(--font-body)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--cyan)";
            e.currentTarget.style.boxShadow = "var(--glow-cyan)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-3 text-xs font-bold tracking-widest transition-all duration-200 disabled:opacity-40"
        style={{
          background: isPending ? "transparent" : "var(--cyan)",
          color: isPending ? "var(--cyan)" : "var(--bg)",
          border: "1px solid var(--cyan)",
          boxShadow: isPending ? "none" : "var(--glow-cyan)",
          fontFamily: "var(--font-display)",
        }}
      >
        {isPending ? "SCANNING…" : "SCAN"}
      </button>
    </form>
  );
}
