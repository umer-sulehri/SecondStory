/**
 * Gemini virtual try-on helper.
 *
 * Uses Google's Gemini image model to composite a clothing item onto a user's
 * photo. Requires GEMINI_API_KEY. When the key is absent (e.g. local demo),
 * callers should fall back to a placeholder.
 */

const GEMINI_MODEL = "gemini-2.5-flash-image-preview";

interface TryOnParams {
  /** Data URL or base64 of the user's photo. */
  userImage: string;
  /** Public URL of the product image. */
  productImage: string;
  productName: string;
}

function stripDataUrl(input: string): { mimeType: string; data: string } {
  const match = input.match(/^data:(.+);base64,(.*)$/);
  if (match) return { mimeType: match[1], data: match[2] };
  return { mimeType: "image/jpeg", data: input };
}

async function fetchAsBase64(url: string): Promise<{ mimeType: string; data: string }> {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  const mimeType = res.headers.get("content-type") ?? "image/jpeg";
  return { mimeType, data: buffer.toString("base64") };
}

/**
 * Generate a try-on preview. Returns a data URL of the generated image,
 * or null if generation is unavailable / failed.
 */
export async function generateTryOn({
  userImage,
  productImage,
  productName,
}: TryOnParams): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const user = stripDataUrl(userImage);
  const product = await fetchAsBase64(productImage);

  const prompt = `You are a virtual fashion try-on assistant. Take the person in the first image and realistically dress them in the clothing item shown in the second image ("${productName}"). Preserve the person's face, body, pose, and background. Make the garment fit naturally with realistic lighting, folds, and shadows. Output only the edited image.`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: user.mimeType, data: user.data } },
            { inlineData: { mimeType: product.mimeType, data: product.data } },
          ],
        },
      ],
    }),
  });

  if (!res.ok) return null;

  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      const mime = part.inlineData.mimeType ?? "image/png";
      return `data:${mime};base64,${part.inlineData.data}`;
    }
  }
  return null;
}
