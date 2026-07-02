"use client";

import { useState } from "react";
import { X, Loader2, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/store/toast";

interface BuyNowModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
  selectedColor?: string;
}

export function BuyNowModal({
  product,
  open,
  onClose,
  selectedColor = "",
}: BuyNowModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(selectedColor);
  const [submitting, setSubmitting] = useState(false);

  // Set default color if not selected and colors are available
  useState(() => {
    if (!selectedColor && product.colors && product.colors.length > 0) {
      setColor(product.colors[0].name);
    }
  });

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !phone.trim()) {
      toast.error("Please fill in all details.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/order-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          name: name.trim(),
          address: address.trim(),
          phone: phone.trim(),
          quantity,
          colorSelected: color,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry");
      }

      toast.success("Order inquiry submitted successfully! We will contact you soon.");
      setName("");
      setAddress("");
      setPhone("");
      setQuantity(1);
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary-light text-primary">
              <ShoppingBag className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold text-text-primary">Buy Now</h2>
              <p className="text-xs text-text-secondary">Instant checkout inquiry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-xl text-text-secondary transition-colors hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-border">
            <img
              src={product.thumbnail}
              alt={product.name}
              className="size-12 object-cover rounded-lg border border-border shrink-0"
            />
            <div className="min-w-0">
              <p className="font-medium text-sm text-text-primary truncate">{product.name}</p>
              <p className="text-xs text-text-secondary">
                Price: Rs. {product.sellingPrice.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-primary">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-primary">Delivery Address</label>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Complete address with street, city, etc."
              rows={2}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-primary">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 03001234567"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-primary">No. of Products</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-primary">Color</label>
              {product.colors && product.colors.length > 0 ? (
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                >
                  {product.colors.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  disabled
                  value="N/A"
                  className="w-full rounded-xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none text-text-secondary cursor-not-allowed"
                />
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-2" size="lg" disabled={submitting}>
            {submitting && <Loader2 className="size-4 animate-spin mr-1" />}
            Confirm Order
          </Button>
        </form>
      </div>
    </div>
  );
}
