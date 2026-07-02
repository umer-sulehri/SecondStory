import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Health check for external integrations.
 * GET /api/health → reports whether Supabase and Gemini are configured
 * and, for Supabase, whether the connection actually works.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const result: {
    supabase: { configured: boolean; connected: boolean; error?: string };
    gemini: { configured: boolean };
  } = {
    supabase: { configured: Boolean(url && anon), connected: false },
    gemini: { configured: Boolean(process.env.GEMINI_API_KEY) },
  };

  if (url && anon) {
    try {
      // Hit the Supabase auth health endpoint — no table required.
      const res = await fetch(`${url}/auth/v1/health`, {
        headers: { apikey: anon },
        cache: "no-store",
      });
      result.supabase.connected = res.ok;
      if (!res.ok) {
        result.supabase.error = `Auth endpoint returned ${res.status}`;
      }
    } catch (error) {
      result.supabase.error =
        error instanceof Error ? error.message : "Connection failed";
    }
  } else {
    result.supabase.error = "Missing NEXT_PUBLIC_SUPABASE_URL or ANON_KEY";
  }

  const allGood = result.supabase.connected;
  return NextResponse.json(result, { status: allGood ? 200 : 503 });
}
