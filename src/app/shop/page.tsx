import type { Metadata } from "next";
import { ShopView } from "@/components/shop/shop-view";
import { getProducts, getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our full collection of curated thrift and vintage pieces.",
};

type SortKey = "featured" | "new" | "price-asc" | "price-desc" | "trending";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  const initialSort: SortKey =
    sort === "new" || sort === "trending" ? (sort as SortKey) : "featured";

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <ShopView products={products} categories={categories} initialSort={initialSort} />
  );
}
