"use client";

import { motion } from "framer-motion";

export interface BarDatum {
  label: string;
  value: number;
}

/** Minimal animated bar chart — no external charting dependency. */
export function BarChart({ data, unit = "" }: { data: BarDatum[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-56 items-end gap-2">
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex w-full flex-1 items-end">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${(d.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
              className="group w-full rounded-t-lg bg-primary/80 transition-colors hover:bg-primary"
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-md bg-text-primary px-1.5 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {d.value}
                {unit}
              </span>
            </motion.div>
          </div>
          <span className="truncate text-xs text-text-secondary">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
