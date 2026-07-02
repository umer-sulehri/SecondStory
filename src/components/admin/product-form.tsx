"use client";

import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Product, Category } from "@/types";
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
      description: parsed.description,
      material: parsed.material,
      size: parsed.size,
      color: parsed.color,
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
        <Field label="Quantity">
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

      <Section title="Media & details">
        <Field label="Thumbnail image URL" error={errors.thumbnail?.message} full>
          <input {...register("thumbnail")} className={input} placeholder="https://…" />
        </Field>
        <Field label="Description" error={errors.description?.message} full>
          <textarea {...register("description")} rows={4} className={input} />
        </Field>
        <Field label="Material">
          <input {...register("material")} className={input} />
        </Field>
        <Field label="Size">
          <input {...register("size")} className={input} />
        </Field>
        <Field label="Color">
          <input {...register("color")} className={input} />
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
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("featured")} className="size-4 accent-primary" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("trending")} className="size-4 accent-primary" />
          Trending
        </label>
        <label className="flex items-center gap-2 text-sm">
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
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary";

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
