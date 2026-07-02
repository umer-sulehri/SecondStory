"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Star, Copy, Trash2, Pencil, Eye, Loader2 } from "lucide-react";
import type { Product, Category } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/store/toast";
import {
  deleteProduct,
  duplicateProduct,
  toggleProductFlag,
  toggleStockStatus,
} from "@/app/admin/actions";

export function ProductsTable({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = initialProducts.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  function categoryName(id: string) {
    return categories.find((c) => c.id === id)?.name ?? "—";
  }

  function run(id: string, fn: () => Promise<{ ok: boolean; error?: string }>, success: string) {
    setBusyId(id);
    startTransition(async () => {
      const res = await fn();
      setBusyId(null);
      if (res.ok) {
        toast.success(success);
        router.refresh();
      } else {
        toast.error(res.error ?? "Action failed");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3.5 focus-within:border-primary">
          <Search className="size-4 text-text-secondary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent py-2.5 text-sm outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border bg-surface">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text-secondary">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-xl">
                      <Image src={p.thumbnail} alt={p.name} fill sizes="44px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="text-xs text-text-secondary">{p.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-text-secondary">{categoryName(p.categoryId)}</td>
                <td className="p-4 font-medium">{formatPrice(p.sellingPrice)}</td>
                <td className="p-4">
                  <select
                    value={p.stockStatus}
                    onChange={(e) =>
                      run(
                        p.id,
                        () => toggleStockStatus(p.id, e.target.value),
                        "Stock status updated."
                      )
                    }
                    disabled={busyId === p.id && pending}
                    className={`rounded-full px-3 py-1 text-xs font-semibold outline-none border cursor-pointer transition-colors ${
                      p.stockStatus === "sold_out"
                        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        : p.stockStatus === "low_stock"
                          ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    <option value="in_stock" className="bg-white text-text-primary">In stock</option>
                    <option value="low_stock" className="bg-white text-text-primary">Low stock</option>
                    <option value="sold_out" className="bg-white text-text-primary">Sold out</option>
                  </select>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    {busyId === p.id && pending ? (
                      <Loader2 className="size-4 animate-spin text-primary" />
                    ) : (
                      <>
                        <IconBtn
                          label="Toggle featured"
                          onClick={() =>
                            run(
                              p.id,
                              () => toggleProductFlag(p.id, "featured", !p.featured),
                              "Featured status updated."
                            )
                          }
                          active={p.featured}
                        >
                          <Star className={p.featured ? "size-4 fill-warning text-warning" : "size-4"} />
                        </IconBtn>
                        <Link href={`/product/${p.slug}`} target="_blank">
                          <IconBtn label="Preview">
                            <Eye className="size-4" />
                          </IconBtn>
                        </Link>
                        <Link href={`/admin/products/${p.id}`}>
                          <IconBtn label="Edit">
                            <Pencil className="size-4" />
                          </IconBtn>
                        </Link>
                        <IconBtn
                          label="Duplicate"
                          onClick={() => run(p.id, () => duplicateProduct(p.id), "Product duplicated.")}
                        >
                          <Copy className="size-4" />
                        </IconBtn>
                        <IconBtn
                          label="Delete"
                          danger
                          onClick={() => {
                            if (confirm(`Delete "${p.name}"? This cannot be undone.`)) {
                              run(p.id, () => deleteProduct(p.id), "Product deleted.");
                            }
                          }}
                        >
                          <Trash2 className="size-4" />
                        </IconBtn>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-text-secondary">No products found.</p>
        )}
      </div>
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  active,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid size-9 place-items-center rounded-lg transition-colors hover:bg-slate-100 ${
        danger ? "text-text-secondary hover:text-error" : "text-text-secondary hover:text-primary"
      } ${active ? "text-warning" : ""}`}
    >
      {children}
    </button>
  );
}
