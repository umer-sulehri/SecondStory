import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface ReviewRow {
  id: string;
  author: string;
  rating: number;
  body: string;
  featured: boolean;
  approved: boolean;
}

async function getAllReviews(): Promise<ReviewRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reviews")
      .select("id, author, rating, body, featured, approved")
      .order("created_at", { ascending: false });
    return (data as ReviewRow[]) ?? [];
  } catch {
    return [];
  }
}

export default async function AdminReviews() {
  const reviews = await getAllReviews();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="mt-1 text-text-secondary">Moderate and feature customer reviews.</p>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-3xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-primary-light font-semibold text-primary">
                  {r.author.charAt(0)}
                </span>
                <div>
                  <p className="font-semibold">{r.author}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={i < r.rating ? "size-3.5 fill-warning text-warning" : "size-3.5 text-slate-300"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {r.featured && <Badge variant="primary">Featured</Badge>}
                {r.approved ? (
                  <Badge variant="success">Approved</Badge>
                ) : (
                  <Badge variant="warning">Pending</Badge>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm text-text-secondary">{r.body}</p>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="rounded-3xl border border-dashed border-border p-8 text-center text-text-secondary">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  );
}
