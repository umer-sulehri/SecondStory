"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/store/toast";
import { createClient } from "@/lib/supabase/client";

const profileSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email(),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

export function ProfileForm({ initial }: { initial: ProfileValues }) {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initial,
  });

  const {
    register: regPw,
    handleSubmit: handlePwSubmit,
    reset: resetPw,
    formState: { errors: pwErrors, isSubmitting: pwSubmitting },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  async function onSubmit(values: ProfileValues) {
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

  async function onChangePassword(values: PasswordValues) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      toast.info("Connect Supabase to change your password.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: values.newPassword,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password changed successfully.");
      resetPw();
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-3xl border border-border bg-surface p-6"
      >
        <h2 className="font-semibold">Personal information</h2>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Full name</label>
          <input {...register("name")} className={inputCls} />
          {errors.name && (
            <p className="mt-1 text-xs text-error">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            {...register("email")}
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm text-text-secondary outline-none"
          />
          <p className="mt-1 text-xs text-text-secondary">
            Email can&apos;t be changed here.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Phone</label>
          <input
            {...register("phone")}
            placeholder="+92 300 1234567"
            className={inputCls}
          />
        </div>

        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Save changes
        </Button>
      </form>

      {/* Change Password */}
      <form
        onSubmit={handlePwSubmit(onChangePassword)}
        className="space-y-5 rounded-3xl border border-border bg-surface p-6"
      >
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary-light text-primary">
            <KeyRound className="size-4" />
          </span>
          <h2 className="font-semibold">Change password</h2>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">New password</label>
          <div className="relative">
            <input
              {...regPw("newPassword")}
              type={showNew ? "text" : "password"}
              placeholder="Min. 8 characters"
              className={inputCls + " pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
              aria-label="Toggle password visibility"
            >
              {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {pwErrors.newPassword && (
            <p className="mt-1 text-xs text-error">{pwErrors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Confirm new password
          </label>
          <div className="relative">
            <input
              {...regPw("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat new password"
              className={inputCls + " pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
              aria-label="Toggle password visibility"
            >
              {showConfirm ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {pwErrors.confirmPassword && (
            <p className="mt-1 text-xs text-error">
              {pwErrors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={pwSubmitting}>
          {pwSubmitting && <Loader2 className="size-4 animate-spin" />}
          Update password
        </Button>
      </form>
    </div>
  );
}
