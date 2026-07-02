import Link from "next/link";
import { Sparkles, Instagram, Twitter, Facebook } from "lucide-react";
import { categories, SITE } from "@/data/mock";
import { NewsletterForm } from "@/components/layout/newsletter-form";

const columns = [
  {
    title: "Shop",
    links: categories.map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Reviews", href: "/#reviews" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          {/* Brand + newsletter */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-white">
                <Sparkles className="size-5" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                Second<span className="text-primary">Story</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-text-secondary">
              {SITE.tagline}. Curated pre-loved fashion with AI-powered try-on
              and instant WhatsApp ordering.
            </p>
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">Join the newsletter</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a
                key={i}
                href={SITE.instagram}
                aria-label="Social link"
                className="grid size-10 place-items-center rounded-xl text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
