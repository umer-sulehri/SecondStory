import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Category } from "@/types";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";

function getIcon(name?: string): LucideIcon {
  const icon = name
    ? (Icons as unknown as Record<string, LucideIcon>)[name]
    : undefined;
  return icon ?? Icons.Tag;
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const visible = categories.filter((c) => !c.hidden);
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Shop by category
        </h2>
        <p className="mt-1 text-text-secondary">
          From everyday staples to rare vintage finds
        </p>
      </Reveal>

      <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {visible.map((category) => {
          const Icon = getIcon(category.icon);
          return (
            <StaggerItem key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-3xl border border-border bg-surface p-6 text-center transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="size-6" />
                </span>
                <span className="text-sm font-semibold">{category.name}</span>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
