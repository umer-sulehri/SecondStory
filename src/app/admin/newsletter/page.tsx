import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("subscribers")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });
    return (data as Subscriber[]) ?? [];
  } catch {
    return [];
  }
}

export default async function AdminNewsletter() {
  const subscribers = await getSubscribers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Newsletter</h1>
          <p className="mt-1 text-text-secondary">{subscribers.length} subscribers</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-surface">
        {subscribers.map((s) => (
          <div key={s.id} className="flex items-center gap-3 border-b border-border p-4 last:border-0">
            <span className="grid size-9 place-items-center rounded-xl bg-primary-light text-primary">
              <Mail className="size-4" />
            </span>
            <span className="flex-1 text-sm font-medium">{s.email}</span>
            <span className="text-xs text-text-secondary">
              Joined {new Date(s.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
        {subscribers.length === 0 && (
          <p className="p-8 text-center text-text-secondary">No subscribers yet.</p>
        )}
      </div>
    </div>
  );
}
