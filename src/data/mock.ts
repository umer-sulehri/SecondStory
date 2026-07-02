import type { Category, Product, Review } from "@/types";

export const SITE = {
  name: "SecondStory",
  tagline: "Give pre-loved fashion a second story",
  whatsappNumber: "+923001234567",
  url: "https://secondstory.com",
  instagram: "https://instagram.com/secondstory",
};

export const categories: Category[] = [
  { id: "c1", name: "Women", slug: "women", icon: "Shirt", order: 1 },
  { id: "c2", name: "Men", slug: "men", icon: "Shirt", order: 2 },
  { id: "c3", name: "Accessories", slug: "accessories", icon: "Watch", order: 3 },
  { id: "c4", name: "Luxury", slug: "luxury", icon: "Gem", order: 4 },
  { id: "c5", name: "Vintage", slug: "vintage", icon: "Clock", order: 5 },
  { id: "c6", name: "Home Decor", slug: "home-decor", icon: "Lamp", order: 6 },
];

/** Deterministic Unsplash-style placeholder images. */
function img(seed: string): string {
  return `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=900&q=80`;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Vintage Denim Jacket",
    slug: "vintage-denim-jacket",
    sku: "SS-DNM-001",
    brand: "Levi's",
    categoryId: "c5",
    subCategory: "Jackets",
    originalPrice: 7500,
    sellingPrice: 4500,
    thumbnail: img("photo-1551537482-f2075a1d41f2"),
    images: [
      { url: img("photo-1551537482-f2075a1d41f2"), alt: "Denim jacket front" },
      { url: img("photo-1576871337622-98d48d1cf531"), alt: "Denim jacket detail" },
      { url: img("photo-1543076447-215ad9ba6923"), alt: "Denim jacket back" },
    ],
    description:
      "A timeless Levi's trucker jacket with a beautifully worn-in finish. The indigo wash has aged into a soft, characterful blue that only vintage denim can offer.",
    material: "100% Cotton Denim",
    size: "Medium",
    color: "Blue",
    gender: "Unisex",
    tags: ["denim", "vintage", "jacket", "levis"],
    condition: { rating: "Excellent", authenticityVerified: true, notes: "Minor fading at cuffs, adds to the vintage character." },
    quantity: 1,
    stockStatus: "in_stock",
    featured: true,
    trending: true,
    newArrival: true,
    views: 1243,
    createdAt: "2026-06-20T10:00:00Z",
  },
  {
    id: "p2",
    name: "Silk Floral Midi Dress",
    slug: "silk-floral-midi-dress",
    sku: "SS-DRS-002",
    brand: "Zara",
    categoryId: "c1",
    subCategory: "Dresses",
    originalPrice: 9000,
    sellingPrice: 5200,
    thumbnail: img("photo-1572804013309-59a88b7e92f1"),
    images: [
      { url: img("photo-1572804013309-59a88b7e92f1"), alt: "Floral dress" },
      { url: img("photo-1612336307429-8a898d10e223"), alt: "Floral dress detail" },
    ],
    description:
      "Flowing silk-blend midi dress in a delicate floral print. Perfect for summer evenings and garden gatherings.",
    material: "Silk Blend",
    size: "Small",
    color: "Rose",
    gender: "Women",
    tags: ["dress", "silk", "floral", "summer"],
    condition: { rating: "Like New", notes: "Worn once. Pristine condition." },
    quantity: 1,
    stockStatus: "in_stock",
    featured: true,
    bestSeller: true,
    views: 982,
    createdAt: "2026-06-22T10:00:00Z",
  },
  {
    id: "p3",
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    sku: "SS-ACC-003",
    brand: "Coach",
    categoryId: "c4",
    subCategory: "Bags",
    originalPrice: 22000,
    sellingPrice: 13500,
    thumbnail: img("photo-1584917865442-de89df76afd3"),
    images: [
      { url: img("photo-1584917865442-de89df76afd3"), alt: "Leather bag" },
      { url: img("photo-1548036328-c9fa89d128fa"), alt: "Leather bag detail" },
    ],
    description:
      "Authentic Coach pebbled-leather crossbody in tan. A versatile everyday luxury piece with adjustable strap.",
    material: "Genuine Leather",
    color: "Tan",
    gender: "Women",
    tags: ["bag", "leather", "luxury", "coach"],
    condition: { rating: "Good", authenticityVerified: true, scratches: true, notes: "Light surface scratches on the base." },
    quantity: 1,
    stockStatus: "in_stock",
    trending: true,
    bestSeller: true,
    views: 1567,
    createdAt: "2026-06-18T10:00:00Z",
  },
  {
    id: "p4",
    name: "Wool Overcoat",
    slug: "wool-overcoat",
    sku: "SS-MEN-004",
    brand: "Uniqlo",
    categoryId: "c2",
    subCategory: "Coats",
    originalPrice: 12000,
    sellingPrice: 6800,
    thumbnail: img("photo-1539533018447-63fcce2678e3"),
    images: [{ url: img("photo-1539533018447-63fcce2678e3"), alt: "Wool overcoat" }],
    description:
      "Tailored wool-blend overcoat in charcoal grey. A sharp layering piece for the colder months.",
    material: "Wool Blend",
    size: "Large",
    color: "Charcoal",
    gender: "Men",
    tags: ["coat", "wool", "winter", "formal"],
    condition: { rating: "Excellent" },
    quantity: 1,
    stockStatus: "in_stock",
    newArrival: true,
    views: 643,
    createdAt: "2026-06-25T10:00:00Z",
  },
  {
    id: "p5",
    name: "Retro Film Camera",
    slug: "retro-film-camera",
    sku: "SS-VTG-005",
    brand: "Canon",
    categoryId: "c5",
    subCategory: "Electronics",
    originalPrice: 18000,
    sellingPrice: 11000,
    thumbnail: img("photo-1516035069371-29a1b244cc32"),
    images: [{ url: img("photo-1516035069371-29a1b244cc32"), alt: "Film camera" }],
    description:
      "A fully working Canon 35mm film camera from the 80s. Lovingly maintained and ready for your next roll.",
    material: "Metal & Glass",
    color: "Black",
    gender: "Unisex",
    tags: ["camera", "vintage", "film", "canon"],
    condition: { rating: "Vintage", repairs: true, notes: "Light seals recently replaced." },
    quantity: 1,
    stockStatus: "low_stock",
    trending: true,
    views: 2103,
    createdAt: "2026-06-15T10:00:00Z",
  },
  {
    id: "p6",
    name: "Cashmere Knit Sweater",
    slug: "cashmere-knit-sweater",
    sku: "SS-WMN-006",
    brand: "H&M",
    categoryId: "c1",
    subCategory: "Tops",
    originalPrice: 6500,
    sellingPrice: 3200,
    thumbnail: img("photo-1576566588028-4147f3842f27"),
    images: [{ url: img("photo-1576566588028-4147f3842f27"), alt: "Knit sweater" }],
    description:
      "Soft cashmere-blend sweater in cream. Cosy, breathable, and endlessly wearable.",
    material: "Cashmere Blend",
    size: "Medium",
    color: "Cream",
    gender: "Women",
    tags: ["sweater", "cashmere", "knit", "cosy"],
    condition: { rating: "Like New" },
    quantity: 1,
    stockStatus: "in_stock",
    newArrival: true,
    bestSeller: true,
    views: 754,
    createdAt: "2026-06-26T10:00:00Z",
  },
  {
    id: "p7",
    name: "Classic Leather Boots",
    slug: "classic-leather-boots",
    sku: "SS-MEN-007",
    brand: "Dr. Martens",
    categoryId: "c2",
    subCategory: "Shoes",
    originalPrice: 16000,
    sellingPrice: 8900,
    thumbnail: img("photo-1605733513597-a8f8341084e6"),
    images: [{ url: img("photo-1605733513597-a8f8341084e6"), alt: "Leather boots" }],
    description:
      "Iconic Dr. Martens 1460 boots in cherry red. Broken in to perfection with plenty of life left.",
    material: "Genuine Leather",
    size: "UK 9",
    color: "Cherry Red",
    gender: "Unisex",
    tags: ["boots", "leather", "docmartens"],
    condition: { rating: "Good", authenticityVerified: true },
    quantity: 1,
    stockStatus: "in_stock",
    featured: true,
    views: 1320,
    createdAt: "2026-06-19T10:00:00Z",
  },
  {
    id: "p8",
    name: "Minimalist Wall Clock",
    slug: "minimalist-wall-clock",
    sku: "SS-HOM-008",
    brand: "Muji",
    categoryId: "c6",
    subCategory: "Decor",
    originalPrice: 4500,
    sellingPrice: 2400,
    thumbnail: img("photo-1563861826100-9cb868fdbe1c"),
    images: [{ url: img("photo-1563861826100-9cb868fdbe1c"), alt: "Wall clock" }],
    description:
      "Clean, Scandinavian-inspired wall clock with a silent sweep movement. A quiet statement piece.",
    material: "Wood & Glass",
    color: "Natural",
    gender: "Unisex",
    tags: ["clock", "decor", "minimalist", "home"],
    condition: { rating: "Like New" },
    quantity: 1,
    stockStatus: "in_stock",
    newArrival: true,
    views: 421,
    createdAt: "2026-06-27T10:00:00Z",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    author: "Ayesha K.",
    rating: 5,
    body: "The denim jacket arrived exactly as described. The AI try-on actually helped me pick the right size. Obsessed!",
    createdAt: "2026-06-10T10:00:00Z",
    featured: true,
  },
  {
    id: "r2",
    author: "Bilal R.",
    rating: 5,
    body: "Smoothest thrift experience I've had. Messaged on WhatsApp and had my boots two days later.",
    createdAt: "2026-06-12T10:00:00Z",
    featured: true,
  },
  {
    id: "r3",
    author: "Sana M.",
    rating: 4,
    body: "Beautiful curation and honest condition reports. The luxury bag was a steal.",
    createdAt: "2026-06-14T10:00:00Z",
    featured: true,
  },
];

// ---- Query helpers (swap for Supabase later) ----

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .concat(products.filter((p) => p.id !== product.id && p.categoryId !== product.categoryId))
    .slice(0, limit);
}

export const featuredProducts = products.filter((p) => p.featured);
export const trendingProducts = products.filter((p) => p.trending);
export const newArrivals = products.filter((p) => p.newArrival);
export const bestSellers = products.filter((p) => p.bestSeller);
