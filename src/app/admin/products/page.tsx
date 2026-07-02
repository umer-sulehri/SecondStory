import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/admin/products-table";
import { getProducts, getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-text-secondary">
            {products.length} products in catalog
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="size-4" />
            Add product
          </Button>
        </Link>
      </div>

      <ProductsTable initialProducts={products} categories={categories} />
    </div>
  );
}
