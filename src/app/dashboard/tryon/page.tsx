"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, Trash2, Download } from "lucide-react";
import { useTryOnHistory } from "@/store/tryon-history";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

export default function TryOnHistoryPage() {
  const { items, remove, clear } = useTryOnHistory();
  const [productMap, setProductMap] = useState<Record<string, Product>>({});

  useEffect(() => {
    const ids = [...new Set(items.map((i) => i.productId))].filter(Boolean);
    if (!ids.length) return;
    fetch("/api/products/by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((r) => r.json())
      .then((data: Product[]) => {
        const map: Record<string, Product> = {};
        data.forEach((p) => (map[p.id] = p));
        setProductMap(map);
      })
      .catch(() => {});
  }, [items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  function download(url: string, id: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `secondstory-tryon-${id}.png`;
    a.click();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Try-on history</h1>
          <p className="mt-1 text-text-secondary">
            {items.length} {items.length === 1 ? "preview" : "previews"} saved
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear}>
            Clear all
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-border py-20 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-light text-primary">
            <Sparkles className="size-7" />
          </span>
          <p className="mt-4 font-medium">No try-ons yet</p>
          <Link href="/try-on" className="mt-4">
            <Button>Try the fitting room</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => {
            const product = productMap[item.productId];
            return (
              <div
                key={item.id}
                className="group overflow-hidden rounded-3xl border border-border bg-surface"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={item.resultImageUrl}
                    alt={product?.name ?? "Try-on result"}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => download(item.resultImageUrl, item.id)}
                      aria-label="Download"
                      className="grid size-9 place-items-center rounded-full bg-white text-text-primary"
                    >
                      <Download className="size-4" />
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      aria-label="Delete"
                      className="grid size-9 place-items-center rounded-full bg-white text-error"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                {product && (
                  <p className="line-clamp-1 p-3 text-sm font-medium">{product.name}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
