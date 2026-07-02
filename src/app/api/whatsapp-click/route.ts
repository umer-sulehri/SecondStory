import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId } = body;
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("whatsapp_clicks").insert({
      product_id: productId,
    });

    if (error) {
      console.error("[whatsapp-click] Supabase error", error);
      // Fallback/ignore if DB is disabled to prevent user block
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[whatsapp-click] Error", error);
    return NextResponse.json({ error: "Failed to record click" }, { status: 500 });
  }
}
