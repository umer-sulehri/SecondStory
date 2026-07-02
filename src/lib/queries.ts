import { createClient } from "@/lib/supabase/server";
import type { Product, Category, Review } from "@/types";
import * as mock from "@/data/mock";

/* ============================================================
   DB → domain mappers
   ============================================================ */

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku ?? "",
    brand: row.brand ?? undefined,
    categoryId: row.category_id ?? "",
    subCategory: row.sub_category ?? undefined,
    originalPrice: Number(row.original_price ?? 0),
    sellingPrice: Number(row.selling_price ?? 0),
    thumbnail: row.thumbnail ?? "",
    images:
      Array.isArray(row.images) && row.images.length
        ? row.images
        : [{ url: row.thumbnail ?? "", alt: row.name }],
    video: row.video ?? undefined,
    description: row.description ?? "",
    material: row.material ?? undefined,
    size: row.size ?? undefined,
    color: row.color ?? undefined,
    gender: row.gender ?? undefined,
    tags: row.tags ?? [],
    condition: row.condition ?? { rating: "Good" },
    quantity: row.quantity ?? 0,
    stockStatus: row.stock_status ?? "in_stock",
    featured: row.featured ?? false,
    trending: row.trending ?? false,
    newArrival: row.new_arrival ?? false,
    bestSeller: row.best_seller ?? false,
    views: row.views ?? 0,
    createdAt: row.created_at ?? new Date().toISOString(),
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
    metaKeywords: row.meta_keywords ?? undefined,
    ogImage: row.og_image ?? undefined,
  };
}

function mapCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon ?? undefined,
    banner: row.banner ?? undefined,
    parentId: row.parent_id ?? null,
    order: row.order ?? 0,
    hidden: row.hidden ?? false,
  };
}

function mapReview(row: any): Review {
  return {
    id: row.id,
    author: row.author,
    avatar: row.avatar ?? undefined,
    rating: row.rating,
    body: row.body,
    createdAt: row.created_at,
    featured: row.featured ?? false,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** True when Supabase env is present. */
function dbEnabled() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

/* ============================================================
   Public queries (server-side). Fall back to mock data when
   the DB is unavailable so the site never renders empty.
   ============================================================ */

export async function getProducts(): Promise<Product[]> {
  if (!dbEnabled()) return mock.products;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or("archived.eq.false,archived.is.null")
      .order("created_at", { ascending: false });
    if (error) return mock.products;
    return (data ?? []).map(mapProduct);
  } catch {
    return mock.products;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!dbEnabled()) return mock.categories;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("order", { ascending: true });
    if (error) return mock.categories;
    return (data ?? []).map(mapCategory);
  } catch {
    return mock.categories;
  }
}

export async function getReviews(): Promise<Review[]> {
  if (!dbEnabled()) return mock.reviews;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });
    if (error) return mock.reviews;
    return (data ?? []).length ? data.map(mapReview) : mock.reviews;
  } catch {
    return mock.reviews;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!dbEnabled()) return mock.getProductBySlug(slug) ?? null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return mock.getProductBySlug(slug) ?? null;
    return mapProduct(data);
  } catch {
    return mock.getProductBySlug(slug) ?? null;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}
