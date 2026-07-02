import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, name, address, phone, quantity, colorSelected } = body;

    if (!productId || !name || !address || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("order_inquiries").insert({
      product_id: productId,
      name,
      address,
      phone,
      quantity,
      color_selected: colorSelected || null,
    });

    if (error) {
      console.error("[order-inquiry] Supabase error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[order-inquiry] Error", error);
    return NextResponse.json({ error: "Failed to record inquiry" }, { status: 500 });
  }
}
