import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ConditionReport } from "@/components/product/condition-report";
import { ProductRail } from "@/components/product/product-rail";
import { getProductBySlug, getProducts } from "@/lib/queries";
import { SITE } from "@/data/mock";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.ogImage ?? product.thumbnail],
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .concat(all.filter((p) => p.id !== product.id && p.categoryId !== product.categoryId))
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => i.url),
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand ?? SITE.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.sellingPrice,
      availability:
        product.stockStatus === "sold_out"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `${SITE.url}/product/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-text-secondary" aria-label="Breadcrumb">
          <span>Shop</span>
          <span className="mx-2">/</span>
          <span className="text-text-primary">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} name={product.name} />
          <div className="flex flex-col gap-6">
            <ProductInfo product={product} />
            <ConditionReport report={product.condition} />
          </div>
        </div>
      </div>

      <ProductRail
        title="You may also like"
        subtitle="Similar pieces from our collection"
        products={related}
      />
    </>
  );
}
