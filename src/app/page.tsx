import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductRail } from "@/components/product/product-rail";
import { WhyUs } from "@/components/home/why-us";
import { TryOnBanner } from "@/components/home/tryon-banner";
import { Reviews } from "@/components/home/reviews";
import { getProducts, getCategories, getReviews } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories, reviews] = await Promise.all([
    getProducts(),
    getCategories(),
    getReviews(),
  ]);

  const featured = products.filter((p) => p.featured);
  const trending = products.filter((p) => p.trending);
  const newArrivals = products.filter((p) => p.newArrival);
  const bestSellers = products.filter((p) => p.bestSeller);

  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} />
      <ProductRail
        title="Featured pieces"
        subtitle="Hand-picked favourites from our curators"
        products={featured.length ? featured : products.slice(0, 4)}
        href="/shop"
      />
      <TryOnBanner />
      <ProductRail
        title="Trending now"
        subtitle="What the community is loving this week"
        products={trending.length ? trending : products.slice(0, 4)}
        href="/shop?sort=trending"
      />
      <ProductRail
        title="New arrivals"
        subtitle="Fresh drops, added daily"
        products={newArrivals.length ? newArrivals : products.slice(0, 4)}
        href="/shop?sort=new"
      />
      <WhyUs />
      <ProductRail
        title="Best sellers"
        subtitle="Tried, tested, and loved"
        products={bestSellers.length ? bestSellers : products.slice(0, 4)}
        href="/shop"
      />
      <Reviews reviews={reviews} />
    </>
  );
}
