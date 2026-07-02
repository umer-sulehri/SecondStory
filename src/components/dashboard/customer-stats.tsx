"use client";

import { Heart, Sparkles, Clock } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { useTryOnHistory } from "@/store/tryon-history";
import { useRecentlyViewed } from "@/store/recently-viewed";

export function DashboardStatsRow() {
  const wishlist = useWishlist((s) => s.ids.length);
  const tryons = useTryOnHistory((s) => s.items.length);
  const recent = useRecentlyViewed((s) => s.ids.length);

  const stats = [
    { label: "Saved items", value: wishlist, icon: Heart },
    { label: "Try-on previews", value: tryons, icon: Sparkles },
    { label: "Recently viewed", value: recent, icon: Clock },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-6"
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-primary-light text-primary">
            <stat.icon className="size-6" />
          </span>
          <div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-text-secondary">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
