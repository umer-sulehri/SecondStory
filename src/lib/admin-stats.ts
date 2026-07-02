import { createClient } from "@/lib/supabase/server";
import { getProducts, getCategories } from "@/lib/queries";
import type { Product } from "@/types";

export interface AdminStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  whatsappClicks: number;
  tryOnRequests: number;
  featuredProducts: number;
  buyNowInquiries: number;
}

async function count(table: string): Promise<number> {
  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getAdminStats(): Promise<{
  stats: AdminStats;
  dailyVisitors: { label: string; value: number }[];
  categoryPerformance: { label: string; value: number }[];
  mostViewed: Product[];
}> {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const [totalUsers, whatsappClicks, tryOnRequests, buyNowInquiries] = await Promise.all([
    count("profiles"),
    count("whatsapp_clicks"),
    count("tryon_history"),
    count("order_inquiries"),
  ]);

  const stats: AdminStats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalUsers,
    whatsappClicks,
    tryOnRequests,
    featuredProducts: products.filter((p) => p.featured).length,
    buyNowInquiries,
  };

  const categoryPerformance = categories.map((c) => ({
    label: c.name,
    value: products
      .filter((p) => p.categoryId === c.id)
      .reduce((sum, p) => sum + (p.views ?? 0), 0),
  }));

  const mostViewed = [...products]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 5);

  // Visitor trend is illustrative until a real analytics pipeline is added.
  const dailyVisitors = [
    { label: "Mon", value: 320 },
    { label: "Tue", value: 410 },
    { label: "Wed", value: 380 },
    { label: "Thu", value: 520 },
    { label: "Fri", value: 610 },
    { label: "Sat", value: 720 },
    { label: "Sun", value: 540 },
  ];

  return { stats, dailyVisitors, categoryPerformance, mostViewed };
}
