"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingImages = [
  "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute -left-32 top-0 size-[480px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 top-40 size-[420px] rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-[360px] rounded-full bg-sky-200/40 blur-3xl" />
      </motion.div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-24">
        {/* Copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-4 py-1.5 text-sm font-medium text-primary"
          >
            <Sparkles className="size-4" />
            AI Virtual Try-On is here
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Give pre-loved fashion a{" "}
            <span className="text-primary">second story</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-md text-lg text-text-secondary"
          >
            Discover unique thrift and vintage pieces. See how they look on you
            with AI, then order instantly on WhatsApp. No checkout, no fuss.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/shop">
              <Button size="lg">
                Shop the collection
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/try-on">
              <Button size="lg" variant="secondary">
                <Sparkles className="size-4" />
                Try it on
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex gap-8"
          >
            {[
              { value: "2,500+", label: "Curated pieces" },
              { value: "100%", label: "Verified condition" },
              { value: "48h", label: "Avg. delivery" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating product cards */}
        <div className="relative hidden h-[480px] lg:block">
          {floatingImages.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.15 }}
              className="absolute overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl"
              style={{
                width: 220,
                height: 300,
                left: `${i * 26}%`,
                top: `${i * 14}%`,
                zIndex: floatingImages.length - i,
              }}
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                className="relative size-full"
              >
                <Image src={src} alt="Featured thrift piece" fill className="object-cover" sizes="220px" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
