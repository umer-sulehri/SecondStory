"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

export default function DashboardWishlist() {
  const ids = useWishlist((s) => s.ids);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ids.length) {
      setLoading(false);
      setItems([]);
      return;
    }
    fetch("/api/products/by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((r) => r.json())
      .then((data: Product[]) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [ids.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Wishlist</h1>
        <p className="mt-1 text-text-secondary">
          {loading ? "Loading…" : `${items.length} ${items.length === 1 ? "item" : "items"} saved`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-3xl border border-border bg-surface animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-border py-20 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-light text-primary">
            <Heart className="size-7" />
          </span>
          <p className="mt-4 font-medium">Nothing saved yet</p>
          <Link href="/shop" className="mt-4">
            <Button>Browse products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
