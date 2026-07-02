"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { GripVertical } from "lucide-react";

/** Draggable before/after comparison slider. */
export function BeforeAfter({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function update(clientX: number) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, x)));
  }

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-[3/4] w-full max-w-sm cursor-ew-resize select-none overflow-hidden rounded-2xl border border-border"
      onMouseDown={(e) => {
        dragging.current = true;
        update(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && update(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => update(e.touches[0].clientX)}
      onTouchMove={(e) => update(e.touches[0].clientX)}
    >
      {/* After (full) */}
      <Image src={after} alt="AI generated preview" fill className="object-cover" />
      <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">
        AI
      </span>

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <div className="relative h-full" style={{ width: ref.current?.offsetWidth ?? "100%" }}>
          <Image src={before} alt="Your original photo" fill className="object-cover" />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
          Original
        </span>
      </div>

      {/* Handle */}
      <div
        className="absolute inset-y-0 flex w-1 items-center justify-center bg-white"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <span className="grid size-9 place-items-center rounded-full bg-white text-primary shadow-lg">
          <GripVertical className="size-5" />
        </span>
      </div>
    </div>
  );
}
