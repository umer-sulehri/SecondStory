import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardMobileNav } from "@/components/dashboard/mobile-nav";
import type { NavItem } from "@/components/dashboard/nav-items";

const items: NavItem[] = [
  { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Categories", href: "/admin/categories", icon: "FolderTree" },
  { label: "Banners", href: "/admin/banners", icon: "ImageIcon" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Reviews", href: "/admin/reviews", icon: "Star" },
  { label: "Newsletter", href: "/admin/newsletter", icon: "Mail" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "CMS Pages", href: "/admin/cms", icon: "FileText" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentUser();
  const supabaseOn = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (supabaseOn) {
    if (!user) redirect("/login?redirect=/admin");
    if (profile?.role !== "admin") redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex max-w-[100rem]">
      <DashboardSidebar items={items} title="Admin" />
      <div className="min-w-0 flex-1">
        <DashboardMobileNav items={items} />
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
