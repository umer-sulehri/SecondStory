import { CategoriesManager } from "@/components/admin/categories-manager";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const categories = await getCategories();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="mt-1 text-text-secondary">
          Create, edit, reorder, and hide categories.
        </p>
      </div>
      <CategoriesManager initial={categories} />
    </div>
  );
}
