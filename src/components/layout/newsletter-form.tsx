"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { toast } from "@/store/toast";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase
        .from("subscribers")
        .insert({ email: values.email });
      if (error && !/duplicate|unique/i.test(error.message)) {
        toast.error(error.message);
        return;
      }
    } else {
      await new Promise((r) => setTimeout(r, 600));
    }
    toast.success("You're subscribed! Watch your inbox for fresh drops.");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
      <div className="flex overflow-hidden rounded-xl border border-border bg-background focus-within:border-primary">
        <input
          type="email"
          placeholder="you@example.com"
          aria-label="Email address"
          {...register("email")}
          className="w-full bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-text-secondary"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="Subscribe"
          className="grid w-12 place-items-center bg-primary text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
      {errors.email && (
        <p className="text-xs text-error">{errors.email.message}</p>
      )}
    </form>
  );
}
