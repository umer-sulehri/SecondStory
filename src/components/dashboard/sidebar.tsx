"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { navIcons, type NavItem } from "@/components/dashboard/nav-items";

export type { NavItem };

export function DashboardSidebar({
  items,
  title,
}: {
  items: NavItem[];
  title: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:block">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col p-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {title}
        </p>
        <nav className="flex flex-1 flex-col gap-1">
          {items.map((item) => {
            const Icon = navIcons[item.icon];
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "/admin" &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-text-secondary hover:bg-slate-100 hover:text-text-primary"
                )}
              >
                {active && (
                  <motion.span
                    layoutId={`sidebar-active-${title}`}
                    className="absolute inset-0 rounded-xl bg-primary-light"
                  />
                )}
                <Icon className="relative size-4.5" />
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-red-50 hover:text-error"
          >
            <LogOut className="size-4.5" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
