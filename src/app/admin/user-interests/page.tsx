import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Heart } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface WishlistRow {
  product_id: string;
  products: {
    id: string;
    name: string;
    thumbnail: string;
    selling_price: number;
    slug: string;
  } | null;
}

export default async function UserInterests() {
  const supabase = await createClient();

  const { data: wishlists, error } = await supabase
    .from("wishlists")
    .select(`
      product_id,
      products (
        id,
        name,
        thumbnail,
        selling_price,
        slug
      )
    `);

  // Aggregate in JS
  const counts: Record<
    string,
    {
      count: number;
      product: {
        id: string;
        name: string;
        thumbnail: string;
        selling_price: number;
        slug: string;
      };
    }
  > = {};

  (wishlists as unknown as WishlistRow[] || []).forEach((row) => {
    if (!row.product_id || !row.products) return;
    if (!counts[row.product_id]) {
      counts[row.product_id] = { count: 0, product: row.products };
    }
    counts[row.product_id].count += 1;
  });

  const sorted = Object.values(counts).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Interests</h1>
        <p className="mt-1 text-text-secondary">
          Products most added to customer wishlists.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load wishlist metrics: {error.message}
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-border py-20 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-light text-primary">
            <Heart className="size-7" />
          </span>
          <p className="mt-4 font-medium text-text-primary">No wishlisted products yet</p>
          <p className="text-sm text-text-secondary">When logged-in users like products, the leaderboard will populate here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-surface">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="p-4 font-semibold w-16 text-center">Rank</th>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Total Likes</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item, index) => (
                <tr key={item.product.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                  <td className="p-4 text-center font-bold text-text-secondary">
                    {index + 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 overflow-hidden rounded-xl border border-border">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/product/${item.product.slug}`}
                          target="_blank"
                          className="font-medium text-text-primary hover:text-primary transition-colors block truncate max-w-xs sm:max-w-md"
                        >
                          {item.product.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-text-primary">
                    {formatPrice(item.product.selling_price)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="grid size-8 place-items-center rounded-lg bg-red-50 text-error font-bold">
                        {item.count}
                      </span>
                      <span className="text-xs text-text-secondary">users wishlisted</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
