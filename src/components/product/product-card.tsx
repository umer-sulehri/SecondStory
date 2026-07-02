"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice, discountPercent } from "@/lib/utils";
import { useWishlist } from "@/store/wishlist";
import { createClient } from "@/lib/supabase/client";

export function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useWishlist();
  const [hovered, setHovered] = useState(false);
  const wished = has(product.id);

  const discount = discountPercent(product.originalPrice, product.sellingPrice);
  const secondImage = product.images?.[1]?.url ?? product.thumbnail;

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggle(product.id);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (wished) {
            await supabase
              .from("wishlists")
              .delete()
              .eq("user_id", user.id)
              .eq("product_id", product.id);
          } else {
            await supabase
              .from("wishlists")
              .insert({ user_id: user.id, product_id: product.id });
          }
        }
      } catch (err) {
        console.error("Failed to sync wishlist to database:", err);
      }
    }
  };

  return (
    <motion.article
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-xl"
    >
      <Link href={`/product/${product.slug}`} className="relative block aspect-[3/4] overflow-hidden">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={cn(
            "object-cover transition-opacity duration-500",
            hovered ? "opacity-0" : "opacity-100"
          )}
        />
        <Image
          src={secondImage}
          alt={`${product.name} alternate view`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={cn(
            "object-cover transition-transform duration-700",
            hovered ? "scale-105 opacity-100" : "opacity-0"
          )}
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && <Badge variant="danger">-{discount}%</Badge>}
          {product.newArrival && <Badge variant="success">New</Badge>}
          {product.trending && <Badge variant="dark">Trending</Badge>}
        </div>

        {/* Condition badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="neutral">{product.condition.rating}</Badge>
        </div>
      </Link>

      {/* Wishlist */}
      <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wished}
        onClick={handleWishlistClick}
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 backdrop-blur transition-transform hover:scale-110 active:scale-90 z-10"
      >
        <motion.span animate={{ scale: wished ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
          <Heart
            className={cn(
              "size-4.5 transition-colors",
              wished ? "fill-error text-error" : "text-text-secondary"
            )}
          />
        </motion.span>
      </button>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.brand && (
          <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
            {product.brand}
          </span>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-1 font-semibold text-text-primary transition-colors group-hover:text-primary"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-text-primary">
              {formatPrice(product.sellingPrice)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-text-secondary line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.views != null && (
            <span className="flex items-center gap-1 text-xs text-text-secondary">
              <Eye className="size-3.5" />
              {product.views}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
