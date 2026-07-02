"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/store/toast";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email(),
  phone: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function ProfileForm({ initial }: { initial: Values }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: initial });

  async function onSubmit(values: Values) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      toast.info("Connect Supabase to save your profile.");
      return;
    }
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ name: values.name, phone: values.phone })
      .eq("id", user.id);

    if (error) toast.error(error.message);
    else toast.success("Profile updated.");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-3xl border border-border bg-surface p-6"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium">Full name</label>
        <input
          {...register("name")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
        />
        {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Email</label>
        <input
          {...register("email")}
          disabled
          className="w-full cursor-not-allowed rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm text-text-secondary outline-none"
        />
        <p className="mt-1 text-xs text-text-secondary">Email can't be changed here.</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Phone</label>
        <input
          {...register("phone")}
          placeholder="+92 300 1234567"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}
