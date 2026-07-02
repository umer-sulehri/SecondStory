import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const banners = [
  { title: "Homepage Hero", size: "1920×800", status: "Active" },
  { title: "Mobile Banner", size: "768×1024", status: "Active" },
  { title: "Promotional Banner", size: "1200×400", status: "Draft" },
  { title: "AI Try-On Banner", size: "1200×600", status: "Active" },
];

export default function AdminBanners() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
          <p className="mt-1 text-text-secondary">Manage homepage and promotional banners.</p>
        </div>
        <Button>
          <ImagePlus className="size-4" />
          Upload banner
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {banners.map((b) => (
          <div key={b.title} className="rounded-3xl border border-border bg-surface p-6">
            <div className="flex aspect-[16/6] items-center justify-center rounded-2xl border border-dashed border-border bg-background text-text-secondary">
              <ImagePlus className="size-8" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{b.title}</p>
                <p className="text-xs text-text-secondary">Recommended {b.size}</p>
              </div>
              <span className={`text-xs font-semibold ${b.status === "Active" ? "text-success" : "text-text-secondary"}`}>
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
