"use client";

import { useMemo, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { products } from "@/data/mock";
import { ProductCard } from "@/components/product/product-card";

const popular = ["Denim", "Vintage", "Leather", "Dress", "Boots"];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) =>
      [p.name, p.brand, p.color, p.subCategory, ...p.tags]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Search</h1>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 focus-within:border-primary">
        <SearchIcon className="size-5 text-text-secondary" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for brands, items, colors…"
          aria-label="Search products"
          className="w-full bg-transparent py-4 text-base outline-none placeholder:text-text-secondary"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear search">
            <X className="size-5 text-text-secondary" />
          </button>
        )}
      </div>

      {!query && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-text-secondary">Popular searches</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {popular.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {query && (
        <div className="mt-8">
          <p className="mb-6 text-text-secondary">
            {results.length} {results.length === 1 ? "result" : "results"} for “{query}”
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="grid place-items-center rounded-3xl border border-dashed border-border py-24 text-center">
              <p className="font-medium">No matches found</p>
              <p className="mt-1 text-sm text-text-secondary">
                Try a different keyword or browse the full shop.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
