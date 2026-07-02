"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedState {
  ids: string[];
  add: (id: string) => void;
  clear: () => void;
}

const MAX = 8;

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      ids: [],
      add: (id) =>
        set((state) => ({
          ids: [id, ...state.ids.filter((x) => x !== id)].slice(0, MAX),
        })),
      clear: () => set({ ids: [] }),
    }),
    { name: "secondstory-recently-viewed" }
  )
);
