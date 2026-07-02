import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function TryOnBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-indigo-700 px-8 py-14 text-center text-white sm:px-16">
          <div aria-hidden className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="absolute -bottom-24 -left-16 size-72 rounded-full bg-white/10 blur-3xl" />

          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Sparkles className="size-4" />
            Powered by Google Gemini
          </span>
          <h2 className="text-balance mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            See it on you before you buy
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Upload a photo and our AI generates a realistic preview of how any
            piece looks on you. Compare, download, and order with confidence.
          </p>
          <Link href="/try-on" className="mt-8 inline-block">
            <Button size="lg" variant="secondary" className="border-white bg-white text-primary hover:bg-white/90">
              Try the virtual fitting room
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
