"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Plus, Trash2, Pencil, ToggleLeft, ToggleRight, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBanners, saveBanner, deleteBanner, toggleBannerStatus } from "@/app/admin/actions";
import { toast } from "@/store/toast";
import type { Banner } from "@/types";

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [size, setSize] = useState("1200×400");
  const [status, setStatus] = useState<"active" | "draft">("draft");
  const [order, setOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await getBanners();
      setBanners(data);
    } catch {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingBanner(null);
    setTitle("");
    setImageUrl("");
    setLinkUrl("");
    setSize("1200×400");
    setStatus("draft");
    setOrder(0);
    setFormOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setImageUrl(b.imageUrl);
    setLinkUrl(b.linkUrl || "");
    setSize(b.size || "1200×400");
    setStatus(b.status);
    setOrder(b.order);
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      toast.error("Please fill in title and image URL");
      return;
    }
    setSubmitting(true);
    try {
      const res = await saveBanner({
        id: editingBanner?.id,
        title,
        imageUrl,
        linkUrl: linkUrl || undefined,
        size,
        status,
        order,
      });
      if (res.ok) {
        toast.success(editingBanner ? "Banner updated" : "Banner created");
        setFormOpen(false);
        loadBanners();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to save banner");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await deleteBanner(id);
      if (res.ok) {
        toast.success("Banner deleted");
        loadBanners();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  const handleToggle = async (id: string, currentStatus: "active" | "draft") => {
    const nextStatus = currentStatus === "active" ? "draft" : "active";
    try {
      const res = await toggleBannerStatus(id, nextStatus);
      if (res.ok) {
        toast.success("Banner status updated");
        loadBanners();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
          <p className="mt-1 text-text-secondary">Manage homepage and promotional banners.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="size-4 mr-1" />
          Add banner
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="aspect-[16/6] rounded-3xl border border-border bg-surface animate-pulse" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-border py-20 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-light text-primary">
            <ImagePlus className="size-7" />
          </span>
          <p className="mt-4 font-medium">No banners uploaded yet</p>
          <Button onClick={openAdd} className="mt-4">
            Upload your first banner
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {banners.map((b) => (
            <div key={b.id} className="rounded-3xl border border-border bg-surface p-6 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/6] w-full overflow-hidden rounded-2xl border border-border bg-slate-50 flex items-center justify-center">
                  {b.imageUrl ? (
                    <img src={b.imageUrl} alt={b.title} className="object-cover w-full h-full" />
                  ) : (
                    <ImagePlus className="size-8 text-text-secondary" />
                  )}
                </div>
                <div className="mt-4 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-text-primary">{b.title}</p>
                    <p className="text-xs text-text-secondary">Size: {b.size || "Default"} · Order: {b.order}</p>
                    {b.linkUrl && <p className="text-xs text-primary truncate max-w-xs mt-1">Link: {b.linkUrl}</p>}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${b.status === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 text-text-secondary"}`}>
                    {b.status === "active" ? "Active" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
                <button
                  onClick={() => handleToggle(b.id, b.status)}
                  className="p-2 hover:bg-slate-50 rounded-xl text-text-secondary transition-colors"
                  title="Toggle status"
                >
                  {b.status === "active" ? <ToggleRight className="size-5 text-primary" /> : <ToggleLeft className="size-5" />}
                </button>
                <button
                  onClick={() => openEdit(b)}
                  className="p-2 hover:bg-slate-50 rounded-xl text-text-secondary hover:text-primary transition-colors"
                  title="Edit banner"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-2 hover:bg-red-50 rounded-xl text-text-secondary hover:text-error transition-colors"
                  title="Delete banner"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-semibold text-text-primary">
                {editingBanner ? "Edit Banner" : "New Banner"}
              </h2>
              <button
                onClick={() => setFormOpen(false)}
                className="grid size-9 place-items-center rounded-xl text-text-secondary transition-colors hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-primary">Banner Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Clearance Sale"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-primary">Image URL</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-primary">Link URL (optional)</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="e.g. /shop?category=sale"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-text-primary">Recommended Size</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 1920×800"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-text-primary">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-primary">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "active" | "draft")}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-4">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="size-4 animate-spin mr-1" />}
                  {editingBanner ? "Save changes" : "Create banner"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
