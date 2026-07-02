import { Bell, Sparkles, Tag, CheckCircle2 } from "lucide-react";

const notifications = [
  {
    icon: Tag,
    title: "New arrivals in Women",
    body: "12 fresh pieces just dropped in your favourite category.",
    time: "2h ago",
    unread: true,
  },
  {
    icon: Sparkles,
    title: "Your try-on is ready",
    body: "Your AI preview for the Vintage Denim Jacket was generated.",
    time: "Yesterday",
    unread: true,
  },
  {
    icon: CheckCircle2,
    title: "Wishlist item back in focus",
    body: "The Leather Crossbody Bag is trending — grab it before it's gone.",
    time: "3 days ago",
    unread: false,
  },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="mt-1 text-text-secondary">Stay on top of drops and updates.</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <div
            key={i}
            className={`flex gap-4 rounded-2xl border p-4 ${
              n.unread ? "border-primary/30 bg-primary-light/40" : "border-border bg-surface"
            }`}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-primary">
              <n.icon className="size-5" />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{n.title}</p>
                <span className="shrink-0 text-xs text-text-secondary">{n.time}</span>
              </div>
              <p className="mt-0.5 text-sm text-text-secondary">{n.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
