import Link from "next/link";
import { Heart, Sparkles, Clock, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { DashboardStatsRow } from "@/components/dashboard/customer-stats";

export default async function DashboardOverview() {
  const { profile } = await getCurrentUser();
  const name = profile?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {name} 👋
        </h1>
        <p className="mt-1 text-text-secondary">
          Here's a snapshot of your SecondStory activity.
        </p>
      </div>

      <DashboardStatsRow />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Browse the shop", href: "/shop", icon: ArrowRight, desc: "Discover new arrivals" },
          { label: "Your wishlist", href: "/dashboard/wishlist", icon: Heart, desc: "Saved favourites" },
          { label: "Try something on", href: "/try-on", icon: Sparkles, desc: "AI fitting room" },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-3xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-primary-light text-primary">
              <card.icon className="size-5" />
            </span>
            <p className="mt-4 font-semibold">{card.label}</p>
            <p className="text-sm text-text-secondary">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
