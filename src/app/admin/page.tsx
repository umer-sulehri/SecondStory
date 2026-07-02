import Image from "next/image";
import {
  Package,
  FolderTree,
  Users,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { BarChart } from "@/components/admin/bar-chart";
import { getAdminStats } from "@/lib/admin-stats";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const { stats, dailyVisitors, categoryPerformance, mostViewed } =
    await getAdminStats();

  const cards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package },
    { label: "Categories", value: stats.totalCategories, icon: FolderTree },
    { label: "Users", value: stats.totalUsers.toLocaleString(), icon: Users },
    { label: "WhatsApp Clicks", value: stats.whatsappClicks.toLocaleString(), icon: MessageCircle },
    { label: "AI Try-On Requests", value: stats.tryOnRequests.toLocaleString(), icon: Sparkles },
    { label: "Featured", value: stats.featuredProducts, icon: Star },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-text-secondary">
          Overview of your store's performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-border bg-surface p-5">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-light text-primary">
              <card.icon className="size-5" />
            </span>
            <p className="mt-3 text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-text-secondary">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-surface p-6">
          <h2 className="mb-6 font-semibold">Daily visitors</h2>
          <BarChart data={dailyVisitors} />
        </div>
        <div className="rounded-3xl border border-border bg-surface p-6">
          <h2 className="mb-6 font-semibold">Category performance (views)</h2>
          <BarChart data={categoryPerformance} />
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-semibold">Most viewed products</h2>
        <div className="space-y-3">
          {mostViewed.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4">
              <span className="w-5 text-sm font-bold text-text-secondary">{i + 1}</span>
              <div className="relative size-12 overflow-hidden rounded-xl">
                <Image src={p.thumbnail} alt={p.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="text-xs text-text-secondary">{formatPrice(p.sellingPrice)}</p>
              </div>
              <span className="text-sm font-semibold text-primary">{p.views} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
