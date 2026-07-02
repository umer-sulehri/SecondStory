"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, Sparkles, Truck, RotateCcw, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/product/whatsapp-button";
import { BuyNowModal } from "@/components/product/buy-now-modal";
import { TryOnModal } from "@/components/tryon/tryon-modal";
import { cn, formatPrice, discountPercent } from "@/lib/utils";
import { useWishlist } from "@/store/wishlist";
import { useRecentlyViewed } from "@/store/recently-viewed";
import { toast } from "@/store/toast";
import { SITE } from "@/data/mock";
import { createClient } from "@/lib/supabase/client";

export function ProductInfo({ product }: { product: Product }) {
  const { has, toggle } = useWishlist();
  const addRecent = useRecentlyViewed((s) => s.add);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const wished = has(product.id);
  const discount = discountPercent(product.originalPrice, product.sellingPrice);

  useEffect(() => {
    addRecent(product.id);
  }, [product.id, addRecent]);

  // Set default selected color if colors exist
  useEffect(() => {
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].name);
    }
  }, [product.colors]);

  async function share() {
    const url = `${SITE.url}/product/${product.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Product link copied to clipboard");
    }
  }

  const handleWishlistClick = async () => {
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

  const specs = [
    ["Brand", product.brand],
    ["Material", product.material],
    ["Size", product.size],
    ["Color", product.color],
    ["Gender", product.gender],
    ["SKU", product.sku],
  ].filter(([, v]) => Boolean(v)) as [string, string][];

  return (
    <div className="flex flex-col gap-6">
      {/* Brand & Title */}
      <div>
        {product.brand && (
          <span className="text-sm font-medium uppercase tracking-wider text-text-secondary">
            {product.brand}
          </span>
        )}
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{product.name}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-3xl font-bold text-primary">
            {formatPrice(product.sellingPrice)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-lg text-text-secondary line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <Badge variant="danger">Save {discount}%</Badge>
            </>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              "size-2 rounded-full",
              product.stockStatus === "sold_out"
                ? "bg-error"
                : product.stockStatus === "low_stock"
                  ? "bg-warning"
                  : "bg-success"
            )}
          />
          <span className="text-sm text-text-secondary">
            {product.stockStatus === "sold_out"
              ? "Sold out"
              : product.stockStatus === "low_stock"
                ? "Only a few left"
                : "In stock · one-of-a-kind"}
          </span>
        </div>
      </div>

      <p className="leading-relaxed text-text-secondary">{product.description}</p>

      {/* Interactive Color Swatches */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-3 rounded-3xl border border-border bg-surface p-5">
          <h3 className="text-sm font-semibold text-text-primary">Available Colors</h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => {
              const isSelected = selectedColor === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    isSelected
                      ? "border-primary bg-primary-light text-primary ring-2 ring-primary/20"
                      : "border-border bg-white hover:border-slate-400 text-text-secondary"
                  )}
                >
                  <span
                    className="size-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                  <span className="text-[10px] opacity-75">
                    ({c.quantity} available)
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => setTryOnOpen(true)}
          >
            <Sparkles className="size-5" />
            Try it on
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
            onClick={handleWishlistClick}
            className="size-13"
          >
            <motion.span animate={{ scale: wished ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
              <Heart className={cn("size-5", wished && "fill-error text-error")} />
            </motion.span>
          </Button>
          <Button variant="outline" size="icon" aria-label="Share product" onClick={share} className="size-13">
            <Share2 className="size-5" />
          </Button>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <WhatsAppButton product={product} />
          <Button
            variant="primary"
            size="lg"
            onClick={() => setBuyNowOpen(true)}
            className="w-full"
          >
            <ShoppingBag className="size-5" />
            Buy Now
          </Button>
        </div>
      </div>

      {/* Perks */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <Truck className="size-5 text-primary" />
          <span className="text-sm font-medium">Fast local delivery</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <RotateCcw className="size-5 text-primary" />
          <span className="text-sm font-medium">Honest condition</span>
        </div>
      </div>

      {/* Specs */}
      {specs.length > 0 && (
        <div className="rounded-3xl border border-border bg-surface p-6">
          <h3 className="font-semibold">Specifications</h3>
          <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {specs.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-border pb-2 text-sm">
                <dt className="text-text-secondary">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="neutral">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      <TryOnModal product={product} open={tryOnOpen} onClose={() => setTryOnOpen(false)} />
      <BuyNowModal
        product={product}
        open={buyNowOpen}
        onClose={() => setBuyNowOpen(false)}
        selectedColor={selectedColor}
      />
    </div>
  );
}
