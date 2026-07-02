"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

/** Throws unless the current user is an authenticated admin. */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") throw new Error("Not authorized");
  return supabase;
}

/** Revalidate every public surface that shows catalog data. */
function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/admin/categories");
  revalidatePath("/admin");
}

export interface ProductInput {
  id?: string;
  name: string;
  sku?: string;
  brand?: string;
  categoryId: string;
  subCategory?: string;
  originalPrice: number;
  sellingPrice: number;
  thumbnail: string;
  images?: { url: string; alt: string }[];
  description: string;
  material?: string;
  size?: string;
  color?: string;
  colors?: { name: string; hex: string; quantity: number }[];
  gender?: string;
  condition: string;
  quantity: number;
  stockStatus?: string;
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  tags?: string[];
}

type ActionResult = { ok: true } | { ok: false; error: string };

export async function saveProduct(input: ProductInput): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const row = {
      name: input.name,
      slug: slugify(input.name),
      sku: input.sku ?? null,
      brand: input.brand ?? null,
      category_id: input.categoryId,
      sub_category: input.subCategory ?? null,
      original_price: input.originalPrice,
      selling_price: input.sellingPrice,
      thumbnail: input.thumbnail,
      images: input.images?.length
        ? input.images
        : [{ url: input.thumbnail, alt: input.name }],
      description: input.description,
      material: input.material ?? null,
      size: input.size ?? null,
      color: input.color ?? null,
      colors: input.colors ?? [],
      gender: input.gender ?? null,
      condition: { rating: input.condition },
      quantity: input.quantity,
      stock_status: input.stockStatus ?? "in_stock",
      featured: input.featured ?? false,
      trending: input.trending ?? false,
      new_arrival: input.newArrival ?? false,
      best_seller: input.bestSeller ?? false,
      tags: input.tags ?? [],
    };

    const { error } = input.id
      ? await supabase.from("products").update(row).eq("id", input.id)
      : await supabase.from("products").insert(row);

    if (error) return { ok: false, error: error.message };
    revalidateStorefront();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function toggleStockStatus(id: string, status: string): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase
      .from("products")
      .update({ stock_status: status })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateStorefront();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateStorefront();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function toggleProductFlag(
  id: string,
  flag: "featured" | "trending" | "new_arrival" | "best_seller",
  value: boolean
): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase
      .from("products")
      .update({ [flag]: value })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateStorefront();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function duplicateProduct(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { data: original, error: fetchErr } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (fetchErr || !original) return { ok: false, error: "Product not found" };

    const { id: _omit, created_at: _omit2, ...rest } = original;
    const copy = {
      ...rest,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
    };
    const { error } = await supabase.from("products").insert(copy);
    if (error) return { ok: false, error: error.message };
    revalidateStorefront();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

/* ---------------- Categories ---------------- */

export async function createCategory(name: string, order: number): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase
      .from("categories")
      .insert({ name, slug: slugify(name), order });
    if (error) return { ok: false, error: error.message };
    revalidateStorefront();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateStorefront();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updateCategory(
  id: string,
  patch: { name?: string; hidden?: boolean; order?: number }
): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const row: Record<string, unknown> = { ...patch };
    if (patch.name) row.slug = slugify(patch.name);
    const { error } = await supabase.from("categories").update(row).eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidateStorefront();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

/* ---------------- Banners ---------------- */

export async function getBanners() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("order", { ascending: true });
    if (error) return [];
    return (data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      imageUrl: row.image_url,
      linkUrl: row.link_url,
      size: row.size,
      status: row.status,
      position: row.position,
      order: row.order,
      createdAt: row.created_at,
    }));
  } catch {
    return [];
  }
}

export async function saveBanner(input: {
  id?: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  size?: string;
  status: "active" | "draft";
  order: number;
}): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const row = {
      title: input.title,
      image_url: input.imageUrl,
      link_url: input.linkUrl ?? null,
      size: input.size ?? null,
      status: input.status,
      "order": input.order,
    };
    const { error } = input.id
      ? await supabase.from("banners").update(row).eq("id", input.id)
      : await supabase.from("banners").insert(row);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteBanner(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function toggleBannerStatus(id: string, status: "active" | "draft"): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase
      .from("banners")
      .update({ status })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

/* ---------------- CMS Pages ---------------- */

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  updatedAt: string;
}

export async function getCmsPages(): Promise<CmsPage[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("cms_pages")
      .select("*")
      .order("title", { ascending: true });
    if (error) return [];
    return (data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      updatedAt: row.updated_at,
    }));
  } catch {
    return [];
  }
}

export async function getCmsPageBySlug(slug: string): Promise<CmsPage | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("cms_pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      updatedAt: data.updated_at,
    };
  } catch {
    return null;
  }
}

export async function saveCmsPage(
  slug: string,
  content: string,
  title: string
): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { data: existing } = await supabase
      .from("cms_pages")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    const row = {
      title,
      slug,
      content,
      updated_at: new Date().toISOString(),
    };

    const { error } = existing
      ? await supabase.from("cms_pages").update(row).eq("id", existing.id)
      : await supabase.from("cms_pages").insert(row);

    if (error) return { ok: false, error: error.message };
    revalidatePath(`/admin/cms/${slug}`);
    revalidatePath(slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}


