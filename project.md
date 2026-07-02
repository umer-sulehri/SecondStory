# SecondStory

> A modern AI-powered thrift shopping platform built with Next.js and Supabase where users can discover unique thrift items, preview how clothes look on them using AI, and purchase instantly through WhatsApp.

---

# Overview

SecondStory is a modern thrift shopping website that allows customers to browse curated second-hand and vintage products.

Unlike traditional eCommerce websites, payments are not processed on the platform. Instead, users communicate directly with the seller through WhatsApp with the selected product details automatically included in the message.

The platform also includes an AI Virtual Try-On feature powered by Google Gemini, allowing users to upload their photo and preview how selected clothing items would look before purchasing.

---

# Goals

- Simple shopping experience
- Premium UI/UX
- Fast product browsing
- AI-powered virtual try-on
- WhatsApp ordering
- Easy product management
- SEO Friendly
- Fully responsive

---

# Tech Stack

Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn UI

Backend
- Next.js Server Actions
- API Routes

Database
- Supabase PostgreSQL

Authentication
- Supabase Auth

Storage
- Supabase Storage

AI
- Google Gemini API
- AI Virtual Try-On

Deployment
- Vercel

---

# User Roles

## Guest

Can

- Browse products
- Search products
- View categories
- View collections
- View product details
- Use AI Try-On (optional login)
- Contact through WhatsApp
- Register
- Login

---

## Customer

Dashboard includes

- Dashboard Overview
- My Profile
- Wishlist
- Saved Products
- My Try-On History
- Recently Viewed
- Notifications
- Account Settings

---

## Admin

Complete website management

---

# Public Website

## Home

Sections

- Hero Banner
- Featured Products
- Trending Products
- New Arrivals
- Best Sellers
- Premium Collection
- Categories
- Recently Added
- Why SecondStory
- AI Try-On Banner
- Customer Reviews
- Instagram Gallery
- Newsletter
- Footer

---

# Product Categories

Unlimited categories

Example

Women

- Dresses
- Hoodies
- Jackets
- Tops

Men

- Shirts
- Hoodies
- Jeans
- Shoes

Accessories

Luxury

Vintage

Electronics

Home Decor

Books

Admin can

- Create
- Edit
- Delete
- Hide
- Reorder

---

# Product Management

Each product includes

## Basic

- Product Name
- Slug
- SKU
- Brand
- Category
- Sub Category

---

## Pricing

- Original Price
- Selling Price
- Discount
- Discount Percentage

---

## Product Media

- Multiple Images
- Product Video
- Thumbnail
- Image Gallery

---

## Product Information

- Description
- Material
- Size
- Color
- Gender
- Tags

---

## Condition Report

- Like New
- Excellent
- Good
- Fair
- Vintage
- Rare

Additional notes

- Stains
- Scratches
- Repairs
- Authenticity Verified

---

## Inventory

- Quantity
- Stock Status
- Featured
- Trending
- New Arrival

---

## SEO

- Meta Title
- Meta Description
- Meta Keywords
- OpenGraph Image

---

# Product Detail Page

Contains

- Product Gallery
- Zoom Images
- Product Description
- Size Guide
- Condition Report
- Product Specifications
- Related Products
- Similar Products
- AI Try-On Button
- Share Product
- WhatsApp Buy Button

---

# AI Virtual Try-On

One of the main features.

Workflow

1. User opens product page.
2. Clicks "Try On".
3. Uploads personal photo.
4. Image uploads to Supabase Storage.
5. Gemini API processes:
   - User Image
   - Product Image
6. AI generates a realistic preview.
7. User compares:
   - Original
   - AI Generated
8. User can download preview.
9. User clicks Buy via WhatsApp.

Features

- Upload validation
- Image compression
- Progress loader
- Retry generation
- Download result
- Save history
- Delete history

---

# WhatsApp Purchase

No checkout.

When user clicks

Buy on WhatsApp

Automatically opens

https://wa.me/

with message

Example

Hello SecondStory 👋

I'm interested in purchasing this item.

Product:
Vintage Denim Jacket

Price:
PKR 4,500

Size:
Medium

Color:
Blue

Product Link:
https://secondstory.com/product/vintage-denim-jacket

Please let me know if it's still available.

Thank you.

---

# Search

Features

- Instant Search
- Auto Suggestions
- Search History
- Popular Searches

---

# Filters

- Category
- Sub Category
- Price
- Brand
- Color
- Size
- Condition
- New Arrival
- Featured

---

# Wishlist

- Save Product
- Remove Product
- Share Wishlist

---

# User Dashboard

## Dashboard

Shows

- Saved Products
- Recently Viewed
- AI Try-On History
- Favorite Categories

---

## Profile

- Name
- Email
- Phone
- Avatar
- Password

---

## Notifications

- New Products
- Featured Drops
- AI Generation Status

---

## Settings

- Profile
- Notifications
- Delete Account

---

# Admin Dashboard

Overview

Cards

- Total Products
- Categories
- Users
- WhatsApp Clicks
- AI Try-On Requests
- Featured Products

Charts

- Daily Visitors
- Product Views
- Most Viewed Products
- Category Performance

---

# Product Management

Admin can

- Create Product
- Update Product
- Delete Product
- Duplicate Product
- Archive Product
- Feature Product
- Upload Images
- Upload Videos

Bulk Actions

- Delete
- Feature
- Hide
- Change Category

---

# Category Management

- Create
- Edit
- Delete
- Reorder
- Icon
- Banner
- SEO

---

# Banner Management

- Homepage Hero
- Mobile Banner
- Promotional Banner
- AI Try-On Banner

---

# User Management

Admin can

- View Users
- Suspend Users
- Delete Users
- View Try-On Usage

---

# Reviews

- Enable/Disable
- Moderate Reviews
- Featured Reviews

---

# Newsletter

Subscribers

Export CSV

---

# Analytics

- Most Viewed Products
- Popular Categories
- WhatsApp Click Count
- AI Try-On Usage
- Returning Users
- Conversion Rate

---

# CMS

Editable

- Homepage
- About
- Contact
- Privacy Policy
- Terms
- FAQ

---

# Authentication

Supabase Auth

Supports

- Email Login
- Google Login
- Forgot Password
- Email Verification

---

# Notifications

- Email
- In-App Toast
- Success Alerts
- Error Alerts

---

# Responsive Design

Supports

- Desktop
- Laptop
- Tablet
- Mobile

---

# Performance

- Image Optimization
- Lazy Loading
- Infinite Scroll
- Pagination
- Server Components
- Code Splitting
- Edge Rendering

---

# Security

- Supabase RLS
- Secure API Routes
- Protected Dashboard
- Input Validation
- Rate Limiting
- Secure File Upload

---

# SEO

- Dynamic Metadata
- Sitemap
- Robots.txt
- Canonical URLs
- Structured Data
- OpenGraph
- Twitter Cards

---

# Future Scope

- Multi Vendor
- Live Auctions
- Product Reservation
- Mobile App
- AI Styling Assistant
- Outfit Recommendation
- Personalized Home Feed
- Loyalty Program