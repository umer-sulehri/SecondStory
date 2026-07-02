import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];
    if (!ids.length) {
      return NextResponse.json([]);
    }
    const products = await getProductsByIds(ids);
    return NextResponse.json(products);
  } catch (e) {
    console.error("[products/by-ids]", e);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
