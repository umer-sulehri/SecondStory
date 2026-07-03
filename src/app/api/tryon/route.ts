import { NextResponse } from "next/server";
import { generateTryOn } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 90; // allow up to 90 seconds for image generation

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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Demo mode: return the product image so the UI stays functional
    console.info("[tryon] No GEMINI_API_KEY — returning demo fallback.");
    return NextResponse.json({
      image: productImage,
      simulated: true,
      detected: "clothing",
    });
  }

  try {
    const result = await generateTryOn({
      userImage,
      productImage,
      productName: productName ?? "selected item",
    });

    if (!result.image) {
      // Return a structured error so the UI can display it to the user
      return NextResponse.json(
        {
          error: result.error ?? "Failed to generate try-on preview",
          detected: result.detected,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      image: result.image,
      detected: result.detected,
      simulated: false,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[tryon] Unexpected error:", msg);
    return NextResponse.json(
      { error: `Generation failed: ${msg}` },
      { status: 500 }
    );
  }
}
