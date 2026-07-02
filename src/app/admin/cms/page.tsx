import { FileText, Pencil } from "lucide-react";

const pages = [
  { title: "Homepage", slug: "/", updated: "2 days ago" },
  { title: "About", slug: "/about", updated: "1 week ago" },
  { title: "Contact", slug: "/contact", updated: "1 week ago" },
  { title: "Privacy Policy", slug: "/privacy", updated: "3 weeks ago" },
  { title: "Terms of Service", slug: "/terms", updated: "3 weeks ago" },
  { title: "FAQ", slug: "/faq", updated: "5 days ago" },
];

export default function AdminCMS() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CMS Pages</h1>
        <p className="mt-1 text-text-secondary">Edit static content pages.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-surface">
        {pages.map((p) => (
          <div key={p.slug} className="flex items-center gap-3 border-b border-border p-4 last:border-0 hover:bg-slate-50">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-light text-primary">
              <FileText className="size-5" />
            </span>
            <div className="flex-1">
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-text-secondary">{p.slug} · updated {p.updated}</p>
            </div>
            <button className="grid size-9 place-items-center rounded-lg text-text-secondary hover:bg-slate-100 hover:text-primary" aria-label={`Edit ${p.title}`}>
              <Pencil className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
