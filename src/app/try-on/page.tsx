"use client";

import Image from "next/image";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { Product } from "@/types";
import { products } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { TryOnModal } from "@/components/tryon/tryon-modal";
import { formatPrice } from "@/lib/utils";

export default function TryOnPage() {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-br from-primary to-indigo-700 p-8 text-center text-white sm:p-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur">
          <Sparkles className="size-4" />
          AI Virtual Fitting Room
        </span>
        <h1 className="text-balance mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Pick a piece and see it on you
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          Choose any item below, upload your photo, and our AI will generate a
          realistic preview in seconds.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <p className="line-clamp-1 font-semibold">{product.name}</p>
              <p className="text-sm text-text-secondary">
                {formatPrice(product.sellingPrice)}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-auto w-full"
                onClick={() => setSelected(product)}
              >
                <Sparkles className="size-4" />
                Try on
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <TryOnModal
          product={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
