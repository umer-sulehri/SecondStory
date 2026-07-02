"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navIcons, type NavItem } from "@/components/dashboard/nav-items";

export function DashboardMobileNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-border bg-surface px-4 py-3 lg:hidden">
      {items.map((item) => {
        const Icon = navIcons[item.icon];
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-white"
                : "bg-slate-100 text-text-secondary"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
