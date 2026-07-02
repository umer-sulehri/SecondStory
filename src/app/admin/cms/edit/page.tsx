"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "@/store/toast";
import { getCmsPageBySlug, saveCmsPage } from "@/app/admin/actions";

function CmsEditorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) {
      toast.error("No page slug specified");
      router.push("/admin/cms");
      return;
    }
    loadPage();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPage = async () => {
    setLoading(true);
    try {
      const page = await getCmsPageBySlug(slug);
      if (page) {
        setTitle(page.title);
        setContent(page.content);
      } else {
        toast.error("CMS page not found");
        router.push("/admin/cms");
      }
    } catch {
      toast.error("Failed to load page content");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      const res = await saveCmsPage(slug, content, title);
      if (res.ok) {
        toast.success("Page updated successfully");
        router.push("/admin/cms");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-text-secondary text-sm">Loading page content...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="max-w-4xl space-y-6">
      <Link
        href="/admin/cms"
        className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to CMS
      </Link>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit CMS Page</h1>
          <p className="mt-1 text-text-secondary">Editing content for: <span className="font-semibold">{slug}</span></p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin mr-1" /> : <Save className="size-4 mr-1" />}
          Save page
        </Button>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-text-primary">Page Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-text-primary">Content (Markdown / HTML)</label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className="w-full font-mono rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-y"
            placeholder="# Write your page content here..."
          />
        </div>
      </div>
    </form>
  );
}

export default function EditCmsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-text-secondary text-sm">Loading page...</p>
      </div>
    }>
      <CmsEditorForm />
    </Suspense>
  );
}
