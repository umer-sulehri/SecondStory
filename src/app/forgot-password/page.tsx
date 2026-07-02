"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/store/toast";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({ email: z.string().email("Enter a valid email") });

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      toast.info("Connect Supabase to enable password reset.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) toast.error(error.message);
    else toast.success("Check your email for a reset link.");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <Link href="/login" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary">
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-3 text-sm focus-within:border-primary">
              <Mail className="size-4 text-text-secondary" />
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full bg-transparent outline-none placeholder:text-text-secondary"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Send reset link
          </Button>
        </form>
      </div>
    </div>
  );
}
