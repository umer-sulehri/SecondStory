import { Leaf, ShieldCheck, Sparkles, MessageCircle } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";

const features = [
  {
    icon: Leaf,
    title: "Sustainable by design",
    body: "Every purchase gives a garment a second life and keeps it out of landfill.",
  },
  {
    icon: ShieldCheck,
    title: "Honest condition reports",
    body: "We grade and verify every item so you know exactly what you're getting.",
  },
  {
    icon: Sparkles,
    title: "AI virtual try-on",
    body: "See how a piece looks on you before you commit, powered by Gemini.",
  },
  {
    icon: MessageCircle,
    title: "Instant WhatsApp ordering",
    body: "No clunky checkout. Tap, chat, and your order is on its way.",
  },
];

export function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Why SecondStory
        </h2>
        <p className="mt-1 text-text-secondary">
          Thrifting, reimagined for the modern shopper
        </p>
      </Reveal>

      <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <StaggerItem key={f.title}>
            <div className="h-full rounded-3xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary-light text-primary">
                <f.icon className="size-6" />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{f.body}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
