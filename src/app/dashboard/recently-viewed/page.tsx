"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { useRecentlyViewed } from "@/store/recently-viewed";
import { products } from "@/data/mock";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

export default function RecentlyViewedPage() {
  const ids = useRecentlyViewed((s) => s.ids);
  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recently viewed</h1>
        <p className="mt-1 text-text-secondary">Pick up where you left off.</p>
      </div>

      {items.length === 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-border py-20 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-light text-primary">
            <Clock className="size-7" />
          </span>
          <p className="mt-4 font-medium">No history yet</p>
          <Link href="/shop" className="mt-4">
            <Button>Start exploring</Button>
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
