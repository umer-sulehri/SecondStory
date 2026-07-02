"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Product, Category } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "new" | "price-asc" | "price-desc" | "trending";

const conditions = ["Like New", "Excellent", "Good", "Fair", "Vintage", "Rare"];

export function ShopView({
  products,
  categories,
  title = "Shop all",
  initialSort = "featured",
}: {
  products: Product[];
  categories: Category[];
  title?: string;
  initialSort?: SortKey;
}) {
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeConditions, setActiveConditions] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (activeCategories.length && !activeCategories.includes(p.categoryId)) return false;
      if (activeConditions.length && !activeConditions.includes(p.condition.rating)) return false;
      if (p.sellingPrice > maxPrice) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.sellingPrice - b.sellingPrice;
        case "price-desc":
          return b.sellingPrice - a.sellingPrice;
        case "new":
          return +new Date(b.createdAt) - +new Date(a.createdAt);
        case "trending":
          return (b.views ?? 0) - (a.views ?? 0);
        default:
          return Number(b.featured ?? 0) - Number(a.featured ?? 0);
      }
    });

    return result;
  }, [products, activeCategories, activeConditions, maxPrice, sort]);

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Category</h3>
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={activeCategories.includes(c.id)}
                onChange={() => toggle(activeCategories, setActiveCategories, c.id)}
                className="size-4 rounded border-border accent-primary"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Condition</h3>
        <div className="space-y-2">
          {conditions.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={activeConditions.includes(c)}
                onChange={() => toggle(activeConditions, setActiveConditions, c)}
                className="size-4 rounded border-border accent-primary"
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
          Max price: PKR {maxPrice.toLocaleString()}
        </h3>
        <input
          type="range"
          min={1000}
          max={25000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Maximum price"
        />
      </div>

      {(activeCategories.length > 0 ||
        activeConditions.length > 0 ||
        maxPrice < 25000) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setActiveCategories([]);
            setActiveConditions([]);
            setMaxPrice(25000);
          }}
        >
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-text-secondary">{filtered.length} items</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort products"
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium outline-none focus:border-primary"
          >
            <option value="featured">Featured</option>
            <option value="new">Newest</option>
            <option value="trending">Trending</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <Button variant="outline" size="md" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">{filterPanel}</div>
        </aside>

        {/* Grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="grid place-items-center rounded-3xl border border-dashed border-border py-24 text-center">
              <p className="font-medium">No products match your filters</p>
              <p className="mt-1 text-sm text-text-secondary">Try adjusting or clearing them.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[80] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-white p-6 shadow-2xl transition-transform",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
              <X className="size-5" />
            </button>
          </div>
          {filterPanel}
          <Button className="mt-8 w-full" onClick={() => setMobileOpen(false)}>
            Show {filtered.length} results
          </Button>
        </div>
      </div>
    </div>
  );
}
