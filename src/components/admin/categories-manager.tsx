"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, GripVertical, Loader2 } from "lucide-react";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/store/toast";
import { createCategory, deleteCategory, updateCategory } from "@/app/admin/actions";

export function CategoriesManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const items = [...initial].sort((a, b) => a.order - b.order);
  const [name, setName] = useState("");
  const [pending, startTransition] = useTransition();

  function run(fn: () => Promise<{ ok: boolean; error?: string }>, success: string) {
    startTransition(async () => {
      const res = await fn();
      if (res.ok) {
        toast.success(success);
        router.refresh();
      } else {
        toast.error(res.error ?? "Action failed");
      }
    });
  }

  function add() {
    if (!name.trim()) return;
    const value = name.trim();
    setName("");
    run(() => createCategory(value, items.length + 1), "Category added.");
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    // Swap their order values in the DB.
    startTransition(async () => {
      const r1 = await updateCategory(a.id, { order: b.order });
      const r2 = await updateCategory(b.id, { order: a.order });
      if (r1.ok && r2.ok) {
        toast.success("Order updated.");
        router.refresh();
      } else {
        toast.error("Could not reorder.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="New category name"
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <Button onClick={add} disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-surface">
        {items.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center gap-3 border-b border-border p-4 last:border-0"
          >
            <GripVertical className="size-4 text-slate-300" />
            <div className="flex flex-1 items-center gap-2">
              <span className="font-medium">{c.name}</span>
              <span className="text-xs text-text-secondary">/{c.slug}</span>
              {c.hidden && <Badge variant="neutral">Hidden</Badge>}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0 || pending}
                aria-label="Move up"
                className="grid size-8 place-items-center rounded-lg text-text-secondary hover:bg-slate-100 disabled:opacity-30"
              >
                <ChevronUp className="size-4" />
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1 || pending}
                aria-label="Move down"
                className="grid size-8 place-items-center rounded-lg text-text-secondary hover:bg-slate-100 disabled:opacity-30"
              >
                <ChevronDown className="size-4" />
              </button>
              <button
                onClick={() => run(() => updateCategory(c.id, { hidden: !c.hidden }), "Visibility updated.")}
                aria-label={c.hidden ? "Show" : "Hide"}
                className="grid size-8 place-items-center rounded-lg text-text-secondary hover:bg-slate-100"
              >
                {c.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete category "${c.name}"?`)) {
                    run(() => deleteCategory(c.id), "Category deleted.");
                  }
                }}
                aria-label="Delete"
                className="grid size-8 place-items-center rounded-lg text-text-secondary hover:bg-red-50 hover:text-error"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="p-8 text-center text-text-secondary">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
