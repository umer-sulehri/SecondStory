import { products, categories } from "@/data/mock";

/** Aggregate metrics derived from the catalog (demo values mixed in). */
export function getAdminStats() {
  return {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalUsers: 1280,
    whatsappClicks: 3420,
    tryOnRequests: 870,
    featuredProducts: products.filter((p) => p.featured).length,
  };
}

export const dailyVisitors = [
  { label: "Mon", value: 320 },
  { label: "Tue", value: 410 },
  { label: "Wed", value: 380 },
  { label: "Thu", value: 520 },
  { label: "Fri", value: 610 },
  { label: "Sat", value: 720 },
  { label: "Sun", value: 540 },
];

export const categoryPerformance = categories.map((c) => ({
  label: c.name,
  value: products.filter((p) => p.categoryId === c.id).reduce((sum, p) => sum + (p.views ?? 0), 0),
}));

export const mostViewed = [...products]
  .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
  .slice(0, 5);
