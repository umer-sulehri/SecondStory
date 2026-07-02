"use client";

import { useEffect, useState } from "react";
import { FileText, Pencil } from "lucide-react";
import Link from "next/link";
import { getCmsPages, saveCmsPage } from "@/app/admin/actions";
import { toast } from "@/store/toast";
import type { CmsPage } from "@/app/admin/actions";

// Default seed pages if database is empty
const DEFAULT_PAGES = [
  { title: "Homepage", slug: "/", content: "# Homepage\nWelcome to SecondStory." },
  { title: "About Us", slug: "/about", content: "# About Us\nWe are SecondStory." },
  { title: "Contact", slug: "/contact", content: "# Contact\nReach out to us." },
  { title: "Privacy Policy", slug: "/privacy", content: "# Privacy Policy\nYour privacy details." },
  { title: "Terms of Service", slug: "/terms", content: "# Terms of Service\nTerms of service." },
  { title: "FAQ", slug: "/faq", content: "# FAQ\nFrequently asked questions." },
];

export default function AdminCMS() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      let data = await getCmsPages();
      if (data.length === 0) {
        // Seed pages into database if empty for demo
        for (const dp of DEFAULT_PAGES) {
          await saveCmsPage(dp.slug, dp.content, dp.title);
        }
        data = await getCmsPages();
      }
      setPages(data);
    } catch {
      toast.error("Failed to load CMS pages");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "recently";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CMS Pages</h1>
        <p className="mt-1 text-text-secondary">Edit static content pages.</p>
      </div>

      {loading ? (
        <div className="space-y-3 rounded-3xl border border-border bg-surface p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 w-full rounded-xl bg-slate-50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-surface">
          {pages.map((p) => (
            <div
              key={p.slug}
              className="flex items-center gap-3 border-b border-border p-4 last:border-0 hover:bg-slate-50"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-primary-light text-primary">
                <FileText className="size-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">{p.title}</p>
                <p className="text-xs text-text-secondary truncate">
                  {p.slug} · updated {formatDate(p.updatedAt)}
                </p>
              </div>
              <Link href={`/admin/cms/edit?slug=${encodeURIComponent(p.slug)}`}>
                <button
                  className="grid size-9 place-items-center rounded-lg text-text-secondary hover:bg-slate-100 hover:text-primary transition-colors"
                  aria-label={`Edit ${p.title}`}
                >
                  <Pencil className="size-4" />
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
