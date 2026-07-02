import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getCategories, getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  return <ProductForm product={product} categories={categories} />;
}
