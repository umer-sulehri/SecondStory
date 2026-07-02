"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/store/toast";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Please enter your name"),
});

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const searchParams = useSearchParams();
  const isLogin = mode === "login";
  const schema = isLogin ? loginSchema : registerSchema;

  type FormValues = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
  });

  async function onSubmit(values: FormValues) {
    console.log("[AuthForm] onSubmit started. Mode:", mode, "Values:", { email: values.email });
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.log("[AuthForm] NEXT_PUBLIC_SUPABASE_URL is missing.");
      toast.info("Connect Supabase to enable authentication.");
      return;
    }

    const destination = searchParams.get("redirect") || "/dashboard";
    console.log("[AuthForm] Redirect destination will be:", destination);
    const supabase = createClient();
    try {
      if (isLogin) {
        console.log("[AuthForm] Calling signInWithPassword...");
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        console.log("[AuthForm] signInWithPassword response:", { error: error?.message, hasSession: !!data?.session });
        if (error) throw error;

        // Save token and user details to localStorage instantly
        if (data.session) {
          try {
            localStorage.setItem("sb_access_token", data.session.access_token);
            if (data.user?.email) {
              localStorage.setItem("sb_user_email", data.user.email);
            }
          } catch {}
        }

        toast.success("Welcome back!");
        console.log("[AuthForm] Navigation starting to:", destination);
        window.location.assign(destination);
      } else {
        console.log("[AuthForm] Calling signUp...");
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: { data: { name: values.name } },
        });
        console.log("[AuthForm] signUp response:", { error: error?.message, hasSession: !!data?.session });
        if (error) throw error;

        if (data.session) {
          try {
            localStorage.setItem("sb_access_token", data.session.access_token);
            if (data.user?.email) {
              localStorage.setItem("sb_user_email", data.user.email);
            }
          } catch {}
          console.log("[AuthForm] SignUp session exists, navigating to:", destination);
          toast.success("Account created. Welcome to SecondStory!");
          window.location.assign(destination);
        } else {
          console.log("[AuthForm] SignUp session is null, navigating to /login");
          toast.success("Account created. Check your email to verify, then sign in.");
          window.location.assign("/login");
        }
      }
    } catch (error) {
      console.error("[AuthForm] Error in onSubmit caught:", error);
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      if (/rate limit/i.test(message)) {
        toast.error(
          "Email rate limit reached. Disable 'Confirm email' in Supabase Auth settings for development."
        );
      } else {
        toast.error(message);
      }
    }
  }

  async function signInWithGoogle() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      toast.info("Connect Supabase to enable Google sign-in.");
      return;
    }
    const destination = searchParams.get("redirect") || "/dashboard";
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${destination}` },
    });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-border bg-surface p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold tracking-tight">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {isLogin
            ? "Sign in to access your wishlist and try-on history."
            : "Join SecondStory to save favourites and try on pieces."}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          {!isLogin && (
            <Field
              icon={<User className="size-4" />}
              label="Full name"
              error={errors.name?.message}
            >
              <input
                type="text"
                placeholder="Jane Doe"
                {...register("name")}
                className="w-full bg-transparent outline-none placeholder:text-text-secondary"
              />
            </Field>
          )}

          <Field
            icon={<Mail className="size-4" />}
            label="Email"
            error={errors.email?.message}
          >
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full bg-transparent outline-none placeholder:text-text-secondary"
            />
          </Field>

          <Field
            icon={<Lock className="size-4" />}
            label="Password"
            error={errors.password?.message}
          >
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full bg-transparent outline-none placeholder:text-text-secondary"
            />
          </Field>

          {isLogin && (
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm font-medium text-primary">
                Forgot password?
              </Link>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isLogin ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-text-secondary">
          <span className="h-px flex-1 bg-border" />
          OR
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button variant="outline" className="w-full" size="lg" onClick={signInWithGoogle}>
          <GoogleIcon />
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-text-secondary">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={isLogin ? "/register" : "/login"}
            className="font-semibold text-primary"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function Field({
  icon,
  label,
  error,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-3 text-sm focus-within:border-primary">
        <span className="text-text-secondary">{icon}</span>
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 6.94L5.84 9.9c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}
