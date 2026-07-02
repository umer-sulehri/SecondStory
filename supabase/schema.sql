-- ============================================================
-- SecondStory — Supabase schema
-- Run this in the Supabase SQL Editor (or via the CLI) to set up
-- the database, then paste your project keys into .env.local.
-- ============================================================

-- Extensions ---------------------------------------------------
create extension if not exists "uuid-ossp";

-- Profiles -----------------------------------------------------
-- One row per auth user, auto-created on sign up via trigger.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  avatar_url text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Categories ---------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  icon text,
  banner text,
  parent_id uuid references public.categories(id) on delete set null,
  "order" int not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

-- Products -----------------------------------------------------
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  sku text,
  brand text,
  category_id uuid references public.categories(id) on delete set null,
  sub_category text,
  original_price numeric not null default 0,
  selling_price numeric not null default 0,
  thumbnail text,
  images jsonb not null default '[]',
  video text,
  description text,
  material text,
  size text,
  color text,
  gender text,
  tags text[] not null default '{}',
  condition jsonb not null default '{}',
  quantity int not null default 1,
  stock_status text not null default 'in_stock',
  featured boolean not null default false,
  trending boolean not null default false,
  new_arrival boolean not null default false,
  best_seller boolean not null default false,
  views int not null default 0,
  meta_title text,
  meta_description text,
  meta_keywords text[],
  og_image text,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_slug_idx on public.products(slug);

-- Wishlist -----------------------------------------------------
create table if not exists public.wishlists (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- Try-on history ----------------------------------------------
create table if not exists public.tryon_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  user_image_url text,
  result_image_url text,
  created_at timestamptz not null default now()
);

-- Newsletter subscribers --------------------------------------
create table if not exists public.subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Reviews ------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  author text not null,
  avatar text,
  rating int not null check (rating between 1 and 5),
  body text not null,
  featured boolean not null default false,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- WhatsApp click analytics ------------------------------------
create table if not exists public.whatsapp_clicks (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Auto-create a profile when a new auth user signs up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.wishlists enable row level security;
alter table public.tryon_history enable row level security;
alter table public.subscribers enable row level security;
alter table public.reviews enable row level security;
alter table public.whatsapp_clicks enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Profiles: users manage their own; admins see all.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Categories & products: public read, admin write.
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (not hidden or public.is_admin());

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (not archived or public.is_admin());

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- Wishlists: each user manages their own.
drop policy if exists "wishlists_own" on public.wishlists;
create policy "wishlists_own" on public.wishlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Try-on history: each user manages their own.
drop policy if exists "tryon_own" on public.tryon_history;
create policy "tryon_own" on public.tryon_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Subscribers: anyone may subscribe; only admins read.
drop policy if exists "subscribers_insert" on public.subscribers;
create policy "subscribers_insert" on public.subscribers
  for insert with check (true);

drop policy if exists "subscribers_admin_read" on public.subscribers;
create policy "subscribers_admin_read" on public.subscribers
  for select using (public.is_admin());

-- Reviews: public reads approved; admins manage.
drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (approved or public.is_admin());

drop policy if exists "reviews_admin_write" on public.reviews;
create policy "reviews_admin_write" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- WhatsApp clicks: anyone may log; admins read.
drop policy if exists "whatsapp_insert" on public.whatsapp_clicks;
create policy "whatsapp_insert" on public.whatsapp_clicks
  for insert with check (true);

drop policy if exists "whatsapp_admin_read" on public.whatsapp_clicks;
create policy "whatsapp_admin_read" on public.whatsapp_clicks
  for select using (public.is_admin());
