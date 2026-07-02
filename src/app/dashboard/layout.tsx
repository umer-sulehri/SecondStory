import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardMobileNav } from "@/components/dashboard/mobile-nav";
import type { NavItem } from "@/components/dashboard/nav-items";

const items: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Profile", href: "/dashboard/profile", icon: "User" },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: "Heart" },
  { label: "Try-On History", href: "/dashboard/tryon", icon: "Sparkles" },
  { label: "Recently Viewed", href: "/dashboard/recently-viewed", icon: "Clock" },
  { label: "Notifications", href: "/dashboard/notifications", icon: "Bell" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentUser();

  // Middleware also guards this, but double-check for safety / demo mode.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !user) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <div className="mx-auto flex max-w-7xl">
      <DashboardSidebar items={items} title="My Account" />
      <div className="min-w-0 flex-1">
        <DashboardMobileNav items={items} />
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
