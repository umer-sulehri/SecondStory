import { NextResponse } from "next/server";
import { generateTryOn } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  userImage?: string;
  productImage?: string;
  productName?: string;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { userImage, productImage, productName } = body;
  if (!userImage || !productImage) {
    return NextResponse.json(
      { error: "userImage and productImage are required" },
      { status: 400 }
    );
  }

  try {
    const generated = await generateTryOn({
      userImage,
      productImage,
      productName: productName ?? "selected item",
    });

    // Demo fallback when no GEMINI_API_KEY is configured: return the product
    // image so the UI flow remains fully functional.
    const image = generated ?? productImage;

    return NextResponse.json({ image, simulated: !generated });
  } catch (error) {
    console.error("[tryon] generation error", error);
    return NextResponse.json(
      { error: "Failed to generate try-on preview" },
      { status: 500 }
    );
  }
}
