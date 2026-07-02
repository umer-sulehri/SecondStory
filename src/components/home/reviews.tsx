import { Star } from "lucide-react";
import type { Review } from "@/types";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";

export function Reviews({ reviews }: { reviews: Review[] }) {
  const featured = reviews.filter((r) => r.featured);
  if (featured.length === 0) return null;

  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Loved by our community
        </h2>
        <p className="mt-1 text-text-secondary">
          Real stories from happy SecondStory shoppers
        </p>
      </Reveal>

      <StaggerGroup className="grid gap-6 md:grid-cols-3">
        {featured.map((review) => (
          <StaggerItem key={review.id}>
            <figure className="flex h-full flex-col rounded-3xl border border-border bg-surface p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < review.rating
                        ? "size-4 fill-warning text-warning"
                        : "size-4 text-slate-300"
                    }
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-text-primary">
                “{review.body}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-primary-light font-semibold text-primary">
                  {review.author.charAt(0)}
                </span>
                <span className="text-sm font-semibold">{review.author}</span>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
