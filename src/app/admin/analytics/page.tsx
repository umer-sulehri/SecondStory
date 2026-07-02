import { BarChart } from "@/components/admin/bar-chart";
import { getAdminStats } from "@/lib/admin-stats";

export const dynamic = "force-dynamic";

export default async function AdminAnalytics() {
  const { stats, dailyVisitors, categoryPerformance, mostViewed } =
    await getAdminStats();

  const metrics = [
    { label: "WhatsApp clicks", value: stats.whatsappClicks.toLocaleString() },
    { label: "AI try-on usage", value: stats.tryOnRequests.toLocaleString() },
    { label: "Registered users", value: stats.totalUsers.toLocaleString() },
    { label: "Total products", value: stats.totalProducts.toLocaleString() },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-text-secondary">Store performance at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-3xl border border-border bg-surface p-6">
            <p className="text-2xl font-bold">{m.value}</p>
            <p className="text-sm text-text-secondary">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-surface p-6">
          <h2 className="mb-6 font-semibold">Daily visitors</h2>
          <BarChart data={dailyVisitors} />
        </div>
        <div className="rounded-3xl border border-border bg-surface p-6">
          <h2 className="mb-6 font-semibold">Popular categories</h2>
          <BarChart data={categoryPerformance} />
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-semibold">Most viewed products</h2>
        <div className="space-y-2">
          {mostViewed.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between border-b border-border py-2 last:border-0">
              <span className="text-sm">
                <span className="mr-3 font-bold text-text-secondary">{i + 1}</span>
                {p.name}
              </span>
              <span className="text-sm font-semibold text-primary">{p.views} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
