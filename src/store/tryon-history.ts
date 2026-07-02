"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TryOnResult } from "@/types";

interface TryOnHistoryState {
  items: TryOnResult[];
  add: (item: TryOnResult) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const MAX = 20;

export const useTryOnHistory = create<TryOnHistoryState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => ({ items: [item, ...state.items].slice(0, MAX) })),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((x) => x.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "secondstory-tryon-history" }
  )
);
