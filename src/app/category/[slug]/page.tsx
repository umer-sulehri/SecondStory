import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ShopView } from "@/components/shop/shop-view";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: `Shop pre-loved ${category.name.toLowerCase()} at SecondStory.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, allProducts, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts(),
    getCategories(),
  ]);
  if (!category) notFound();

  const items = allProducts.filter((p) => p.categoryId === category.id);

  return <ShopView products={items} categories={categories} title={category.name} />;
}
