"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, User, Menu, X, Sparkles, LayoutDashboard, Shield, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { categories, SITE } from "@/data/mock";
import { useWishlist } from "@/store/wishlist";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  ...categories.slice(0, 4).map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
  { label: "Try-On", href: "/try-on" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const wishlistCount = useWishlist((s) => s.ids.length);
  const { isAuthed, isAdmin } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const dynamicLinks = [
    ...navLinks,
    ...(isAuthed ? [{ label: "Dashboard", href: "/dashboard" }] : []),
    ...(isAdmin ? [{ label: "Admin Panel", href: "/admin" }] : []),
  ];
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-white/80 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-white">
            <Sparkles className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Second<span className="text-primary">Story</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-text-primary hover:text-primary"
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link href="/search" aria-label="Search" className="grid size-10 place-items-center rounded-xl text-text-primary transition-colors hover:bg-slate-100">
            <Search className="size-5" />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="relative grid size-10 place-items-center rounded-xl text-text-primary transition-colors hover:bg-slate-100">
            <Heart className="size-5" />
            {wishlistCount > 0 && (
              <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-2 ml-2">
            {isAuthed ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-text-primary transition-all hover:bg-slate-50 active:scale-[0.97]"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/10 active:scale-[0.97]"
                  >
                    Admin Panel
                  </Link>
                )}
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-text-secondary transition-all hover:bg-red-50 hover:text-error hover:border-error/20 active:scale-[0.97]"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-text-primary transition-all hover:bg-slate-50 active:scale-[0.97]"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-[0.97] shadow-sm shadow-primary/10"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          {/* Mobile Profile Dropdown */}
          <div ref={accountRef} className="relative lg:hidden">
            <button
              aria-label="Account"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-xl text-text-primary transition-colors hover:bg-slate-100"
            >
              <User className="size-5" />
            </button>
            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-xl"
                >
                  {isAuthed ? (
                    <>
                      <DropdownLink href="/dashboard" icon={LayoutDashboard} label="My Dashboard" />
                      <DropdownLink href="/dashboard/wishlist" icon={Heart} label="Wishlist" />
                      {isAdmin && (
                        <DropdownLink href="/admin" icon={Shield} label="Admin Panel" />
                      )}
                      <form action="/auth/signout" method="post">
                        <button
                          type="submit"
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-red-50 hover:text-error"
                        >
                          <LogOut className="size-4" />
                          Sign out
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      <DropdownLink href="/login" icon={User} label="Sign in" />
                      <DropdownLink href="/register" icon={Sparkles} label="Create account" />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-xl text-text-primary transition-colors hover:bg-slate-100 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-white lg:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {dynamicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary-light text-primary"
                      : "text-text-primary hover:bg-slate-100"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthed && (
                <div className="mt-2 pt-2 border-t border-border flex flex-col gap-1">
                  <Link
                    href="/login"
                    className="rounded-xl px-4 py-3 text-sm font-medium text-text-primary hover:bg-slate-100"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-xl px-4 py-3 text-sm font-medium text-primary hover:bg-primary-light"
                  >
                    Create account
                  </Link>
                </div>
              )}
              {isAuthed && (
                <form action="/auth/signout" method="post" className="w-full mt-2 pt-2 border-t border-border">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-red-50 hover:text-error"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function DropdownLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof User;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-slate-100"
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}
