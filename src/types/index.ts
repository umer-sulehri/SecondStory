/* ============================================================
   Domain Types for SecondStory
   ============================================================ */

export type ProductCondition =
  | "Like New"
  | "Excellent"
  | "Good"
  | "Fair"
  | "Vintage"
  | "Rare";

export type Gender = "Women" | "Men" | "Unisex" | "Kids";

export type StockStatus = "in_stock" | "low_stock" | "sold_out";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  banner?: string;
  parentId?: string | null;
  order: number;
  hidden?: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ConditionReport {
  rating: ProductCondition;
  stains?: boolean;
  scratches?: boolean;
  repairs?: boolean;
  authenticityVerified?: boolean;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand?: string;
  categoryId: string;
  subCategory?: string;

  // Pricing
  originalPrice: number;
  sellingPrice: number;

  // Media
  thumbnail: string;
  images: ProductImage[];
  video?: string;

  // Information
  description: string;
  material?: string;
  size?: string;
  color?: string;
  gender?: Gender;
  tags: string[];

  // Condition
  condition: ConditionReport;

  // Inventory
  quantity: number;
  stockStatus: StockStatus;
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;

  // Meta
  views?: number;
  createdAt: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  body: string;
  createdAt: string;
  featured?: boolean;
}

export interface TryOnResult {
  id: string;
  productId: string;
  userImageUrl: string;
  resultImageUrl: string;
  createdAt: string;
}
