"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  loading: boolean;
  isAuthed: boolean;
  isAdmin: boolean;
  email: string | null;
}

const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

/** Client-side auth state for navbar/UI. Safe to call when Supabase is off. */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: supabaseConfigured,
    isAuthed: false,
    isAdmin: false,
    email: null,
  });

  useEffect(() => {
    if (!supabaseConfigured) return;

    // Quick check: set initial state from localStorage to prevent navigation flicker
    try {
      const token = localStorage.getItem("sb_access_token");
      if (token) {
        const cachedRole = localStorage.getItem("sb_user_role");
        const cachedEmail = localStorage.getItem("sb_user_email");
        setState({
          loading: false,
          isAuthed: true,
          isAdmin: cachedRole === "admin",
          email: cachedEmail,
        });
      }
    } catch (e) {
      console.warn("localStorage access error:", e);
    }

    const supabase = createClient();
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;

      if (!user) {
        try {
          localStorage.removeItem("sb_access_token");
          localStorage.removeItem("sb_user_role");
          localStorage.removeItem("sb_user_email");
        } catch {}
        setState({ loading: false, isAuthed: false, isAdmin: false, email: null });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (active) {
        const role = profile?.role ?? "customer";
        const email = user.email ?? null;
        
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session) {
            localStorage.setItem("sb_access_token", sessionData.session.access_token);
          }
          localStorage.setItem("sb_user_role", role);
          if (email) localStorage.setItem("sb_user_email", email);
        } catch {}

        setState({
          loading: false,
          isAuthed: true,
          isAdmin: role === "admin",
          email,
        });
      }
    }

    load();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        try {
          localStorage.removeItem("sb_access_token");
          localStorage.removeItem("sb_user_role");
          localStorage.removeItem("sb_user_email");
        } catch {}
        setState({ loading: false, isAuthed: false, isAdmin: false, email: null });
      } else {
        load();
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
