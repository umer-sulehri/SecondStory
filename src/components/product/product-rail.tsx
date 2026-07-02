import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";

interface ProductRailProps {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
}

export function ProductRail({ title, subtitle, products, href }: ProductRailProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-text-secondary">{subtitle}</p>}
        </div>
        {href && (
          <Link
            href={href}
            className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-primary"
          >
            View all
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </Reveal>

      <StaggerGroup className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
