"use client";

import { MessageCircle } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, formatPrice } from "@/lib/utils";
import { SITE } from "@/data/mock";

export function WhatsAppButton({
  product,
  className,
  size = "lg",
}: {
  product: Product;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const message = [
    "Hello SecondStory 👋",
    "",
    "I'm interested in purchasing this item.",
    "",
    `Product: ${product.name}`,
    `Price: ${formatPrice(product.sellingPrice)}`,
    product.size ? `Size: ${product.size}` : null,
    product.color ? `Color: ${product.color}` : null,
    "",
    `Product Link: ${SITE.url}/product/${product.slug}`,
    "",
    "Please let me know if it's still available.",
    "",
    "Thank you.",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const href = buildWhatsAppLink(SITE.whatsappNumber, message);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      <Button variant="whatsapp" size={size} className="w-full">
        <MessageCircle className="size-5" />
        Buy on WhatsApp
      </Button>
    </a>
  );
}
