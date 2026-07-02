import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase session on every request and guards protected routes.
 * Returns the response (with refreshed auth cookies) to forward.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // No Supabase configured — let everything through (demo mode).
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const path = request.nextUrl.pathname;
  const isDashboard = path.startsWith("/dashboard");
  const isAdmin = path.startsWith("/admin");

  console.log("[Middleware] Path:", path);
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log("[Middleware] getUser error:", error.message);
    } else {
      user = data.user;
      console.log("[Middleware] getUser success:", user ? user.email : "no user");
    }
  } catch (e) {
    console.log("[Middleware] getUser exception:", e);
  }

  // Redirect unauthenticated users away from protected areas.
  if (!user && (isDashboard || isAdmin)) {
    console.log("[Middleware] Redirecting unauthenticated user from protected path:", path);
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/login";
    redirect.searchParams.set("redirect", path);
    return NextResponse.redirect(redirect);
  }

  // Enforce admin-only access to /admin.
  if (user && isAdmin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const redirect = request.nextUrl.clone();
      redirect.pathname = "/dashboard";
      return NextResponse.redirect(redirect);
    }
  }

  return response;
}
