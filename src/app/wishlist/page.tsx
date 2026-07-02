"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { products } from "@/data/mock";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Your wishlist</h1>
      <p className="mt-1 text-text-secondary">
        {items.length} {items.length === 1 ? "item" : "items"} saved
      </p>

      {items.length === 0 ? (
        <div className="mt-12 grid place-items-center rounded-3xl border border-dashed border-border py-24 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-primary-light text-primary">
            <Heart className="size-8" />
          </span>
          <p className="mt-4 font-medium">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-text-secondary">
            Tap the heart on any product to save it here.
          </p>
          <Link href="/shop" className="mt-6">
            <Button>Start browsing</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
