"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft, Plus, Trash2, Palette } from "lucide-react";
import Link from "next/link";
import type { Product, Category, ProductColor } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/store/toast";
import { saveProduct } from "@/app/admin/actions";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  sku: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.string().min(1, "Select a category"),
  subCategory: z.string().optional(),
  originalPrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),
  thumbnail: z.string().url("Enter a valid image URL"),
  description: z.string().min(10, "Add a longer description"),
  material: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  gender: z.enum(["Women", "Men", "Unisex", "Kids"]).optional(),
  condition: z.enum(["Like New", "Excellent", "Good", "Fair", "Vintage", "Rare"]),
  quantity: z.coerce.number().min(0),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  newArrival: z.boolean().optional(),
});

type Values = z.input<typeof schema>;
type Output = z.output<typeof schema>;

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const editing = Boolean(product);

  // Multiple Images state
  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    product?.images || []
  );

  // Colors state
  const [colors, setColors] = useState<ProductColor[]>(
    product?.colors || []
  );

  // Temp state for adding a color
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [newColorQty, setNewColorQty] = useState(1);

  // Temp state for adding an image URL
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema) as unknown as Resolver<Values>,
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          brand: product.brand,
          categoryId: product.categoryId,
          subCategory: product.subCategory,
          originalPrice: product.originalPrice,
          sellingPrice: product.sellingPrice,
          thumbnail: product.thumbnail,
          description: product.description,
          material: product.material,
          size: product.size,
          color: product.color,
          gender: product.gender,
          condition: product.condition.rating,
          quantity: product.quantity,
          featured: product.featured,
          trending: product.trending,
          newArrival: product.newArrival,
        }
      : { condition: "Good", quantity: 1, originalPrice: 0, sellingPrice: 0 },
  });

  async function onSubmit(values: Values) {
    const parsed = schema.parse(values) as Output;
    
    // Fallback images if list is empty
    const finalImages = images.length
      ? images
      : [{ url: parsed.thumbnail, alt: parsed.name }];

    const res = await saveProduct({
      id: product?.id,
      name: parsed.name,
      sku: parsed.sku,
      brand: parsed.brand,
      categoryId: parsed.categoryId,
      subCategory: parsed.subCategory,
      originalPrice: parsed.originalPrice,
      sellingPrice: parsed.sellingPrice,
      thumbnail: parsed.thumbnail,
      images: finalImages,
      description: parsed.description,
      material: parsed.material,
      size: parsed.size,
      color: parsed.color || (colors.length ? colors.map(c => c.name).join(", ") : undefined),
      colors: colors,
      gender: parsed.gender,
      condition: parsed.condition,
      quantity: parsed.quantity,
      featured: parsed.featured,
      trending: parsed.trending,
      newArrival: parsed.newArrival,
    });

    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(editing ? "Product updated." : "Product created.");
    router.push("/admin/products");
    router.refresh();
  }

  const addColor = () => {
    if (!newColorName.trim()) {
      toast.error("Please enter a color name.");
      return;
    }
    if (colors.some((c) => c.name.toLowerCase() === newColorName.toLowerCase())) {
      toast.error("Color name already exists.");
      return;
    }
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex, quantity: newColorQty }]);
    setNewColorName("");
    setNewColorQty(1);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const addImageUrl = () => {
    if (!newImageUrl.trim() || !newImageUrl.startsWith("http")) {
      toast.error("Please enter a valid image URL.");
      return;
    }
    setImages([...images, { url: newImageUrl.trim(), alt: newImageAlt.trim() || "Product image" }]);
    setNewImageUrl("");
    setNewImageAlt("");
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">
        {editing ? "Edit product" : "New product"}
      </h1>

      <Section title="Basics">
        <Field label="Product name" error={errors.name?.message} full>
          <input {...register("name")} className={input} placeholder="Vintage Denim Jacket" />
        </Field>
        <Field label="SKU">
          <input {...register("sku")} className={input} placeholder="SS-DNM-001" />
        </Field>
        <Field label="Brand">
          <input {...register("brand")} className={input} placeholder="Levi's" />
        </Field>
        <Field label="Category" error={errors.categoryId?.message}>
          <select {...register("categoryId")} className={input}>
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Sub category">
          <input {...register("subCategory")} className={input} placeholder="Jackets" />
        </Field>
      </Section>

      <Section title="Pricing & inventory">
        <Field label="Original price (PKR)" error={errors.originalPrice?.message}>
          <input type="number" {...register("originalPrice")} className={input} />
        </Field>
        <Field label="Selling price (PKR)" error={errors.sellingPrice?.message}>
          <input type="number" {...register("sellingPrice")} className={input} />
        </Field>
        <Field label="Total quantity">
          <input type="number" {...register("quantity")} className={input} />
        </Field>
        <Field label="Condition">
          <select {...register("condition")} className={input}>
            {["Like New", "Excellent", "Good", "Fair", "Vintage", "Rare"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Images (Multiple)">
        <Field label="Thumbnail image URL" error={errors.thumbnail?.message} full>
          <input {...register("thumbnail")} className={input} placeholder="https://…" />
        </Field>

        <div className="sm:col-span-2 space-y-4 border-t border-border pt-4">
          <label className="block text-sm font-semibold text-text-primary">Additional Gallery Images</label>
          
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Image URL (https://...)"
                className={input}
              />
            </div>
            <div>
              <input
                type="text"
                value={newImageAlt}
                onChange={(e) => setNewImageAlt(e.target.value)}
                placeholder="Alt description (optional)"
                className={input}
              />
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addImageUrl} className="mt-1">
            <Plus className="size-4 mr-1" /> Add to gallery
          </Button>

          {images.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 mt-4 bg-slate-50 p-4 rounded-2xl border border-border">
              {images.map((img, index) => (
                <div key={index} className="flex items-center justify-between gap-3 bg-white p-2 rounded-xl border border-border">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={img.url} alt={img.alt} className="size-10 object-cover rounded-lg border border-border shrink-0" />
                    <span className="text-xs truncate text-text-secondary">{img.url}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1.5 text-text-secondary hover:text-error shrink-0"
                    aria-label="Remove image"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section title="Colors (Multiple variants)">
        <div className="sm:col-span-2 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3 items-end">
            <div>
              <label className="mb-1.5 block text-xs font-medium">Color Name</label>
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="e.g. Olive Green"
                className={input}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">Color Output (Hex Code)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="size-10 rounded-xl border border-border cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  placeholder="#000000"
                  className={input + " flex-1 uppercase"}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">Quantity</label>
              <input
                type="number"
                value={newColorQty}
                onChange={(e) => setNewColorQty(Number(e.target.value))}
                min="0"
                className={input}
              />
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addColor}>
            <Plus className="size-4 mr-1" /> Add Color Variant
          </Button>

          {colors.length > 0 && (
            <div className="space-y-2 mt-4 bg-slate-50 p-4 rounded-2xl border border-border">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">Configured Colors</label>
              <div className="grid gap-2">
                {colors.map((c, index) => (
                  <div key={index} className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      <span
                        className="size-6 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-text-secondary uppercase">{c.hex} · Qty: {c.quantity}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="p-1.5 text-text-secondary hover:text-error"
                      aria-label="Remove color"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section title="Details & specifications">
        <Field label="Description" error={errors.description?.message} full>
          <textarea {...register("description")} rows={4} className={input} />
        </Field>
        <Field label="Material">
          <input {...register("material")} className={input} placeholder="100% Cotton" />
        </Field>
        <Field label="Size">
          <input {...register("size")} className={input} placeholder="M / L" />
        </Field>
        <Field label="Fallback Color Text">
          <input {...register("color")} className={input} placeholder="Blue (legacy field)" />
        </Field>
        <Field label="Gender">
          <select {...register("gender")} className={input}>
            <option value="">—</option>
            {["Women", "Men", "Unisex", "Kids"].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Visibility">
        <label className="flex items-center gap-2 text-sm select-none">
          <input type="checkbox" {...register("featured")} className="size-4 accent-primary" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm select-none">
          <input type="checkbox" {...register("trending")} className="size-4 accent-primary" />
          Trending
        </label>
        <label className="flex items-center gap-2 text-sm select-none">
          <input type="checkbox" {...register("newArrival")} className="size-4 accent-primary" />
          New arrival
        </label>
      </Section>

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {editing ? "Save changes" : "Create product"}
        </Button>
        <Link href="/admin/products">
          <Button type="button" variant="outline" size="lg">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}

const input =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6">
      <h2 className="mb-4 font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
