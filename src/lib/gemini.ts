/**
 * Gemini virtual try-on helper — rewritten for proper image generation.
 *
 * Uses Google's Gemini image model to:
 * 1. Detect the product category (clothing, shoes, accessories, etc.)
 * 2. Detect and validate the user's photo has a person in it
 * 3. Generate a realistic composite of the person wearing/using the product
 *
 * Requires GEMINI_API_KEY in environment variables.
 */

// The model that supports native image output (TEXT + IMAGE modalities)
const GEMINI_IMAGE_MODEL = "gemini-2.0-flash-preview-image-generation";

// Fallback text model for detection step
const GEMINI_TEXT_MODEL = "gemini-2.0-flash";

interface TryOnParams {
  /** Data URL (base64) of the user's photo */
  userImage: string;
  /** Base64 data URL OR public URL of the product image */
  productImage: string;
  productName: string;
}

export interface TryOnResult {
  image: string | null;
  detected: string | null;
  error?: string;
}

/** Strip data URL prefix and return mime + raw base64 */
function stripDataUrl(input: string): { mimeType: string; data: string } {
  const match = input.match(/^data:(.+?);base64,(.+)$/s);
  if (match) return { mimeType: match[1], data: match[2] };
  // Treat bare string as raw base64
  return { mimeType: "image/jpeg", data: input };
}

/** Fetch a remote image URL and return as base64 */
async function fetchAsBase64(url: string): Promise<{ mimeType: string; data: string }> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch product image: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const mimeType = res.headers.get("content-type")?.split(";")[0]?.trim() ?? "image/jpeg";
  return { mimeType, data: buffer.toString("base64") };
}

/** Call Gemini text model to detect & classify the product/person */
async function detectContent(
  apiKey: string,
  imageData: { mimeType: string; data: string },
  question: string
): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TEXT_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: question },
            { inlineData: { mimeType: imageData.mimeType, data: imageData.data } },
          ],
        },
      ],
      generationConfig: { maxOutputTokens: 200, temperature: 0.1 },
    }),
  });

  const json = await res.json();
  return json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
}

/**
 * Build the compositing prompt based on detected product type.
 * This creates very specific instructions so Gemini knows exactly
 * how to place the item onto the person.
 */
function buildTryOnPrompt(productName: string, productType: string): string {
  const type = productType.toLowerCase();

  if (type.includes("shoe") || type.includes("boot") || type.includes("sneaker") || type.includes("footwear") || type.includes("sandal")) {
    return `You are a professional virtual try-on AI. The first image shows a person. The second image shows a pair of shoes/footwear called "${productName}".

Task: Generate a single realistic photo showing the person from the first image wearing the shoes from the second image on their feet.

Requirements:
- Keep the person's body, face, hair, clothing (except shoes) and pose EXACTLY as in the original
- Replace their feet/existing shoes with the "${productName}" shoes from the second image
- Match the lighting direction, shadows, and perspective realistically
- Ensure the shoes fit naturally on the feet with proper perspective and scale
- Output ONLY the edited photo, no text or borders`;
  }

  if (type.includes("bag") || type.includes("handbag") || type.includes("purse") || type.includes("backpack") || type.includes("accessory") || type.includes("hat") || type.includes("cap") || type.includes("watch") || type.includes("jewelry") || type.includes("scarf") || type.includes("glasses") || type.includes("sunglasses")) {
    return `You are a professional virtual try-on AI. The first image shows a person. The second image shows an accessory called "${productName}".

Task: Generate a single realistic photo showing the person from the first image using/wearing the "${productName}" accessory from the second image.

Requirements:
- Keep the person's body, face, and existing outfit EXACTLY the same
- Add/place the "${productName}" on/with the person in the most natural way (held, worn, etc.)
- Match the lighting direction and shadows realistically
- Make it look like a genuine lifestyle photo
- Output ONLY the edited photo, no text or borders`;
  }

  // Default: clothing (shirt, dress, jacket, pants, etc.)
  return `You are a professional virtual fashion try-on AI. The first image shows a real person. The second image shows a clothing item called "${productName}".

Task: Generate a single photorealistic image of the person wearing the clothing item from the second image.

Requirements:
- Preserve the EXACT face, hairstyle, skin tone, and body shape of the person from image 1
- Keep the same pose, background, and camera angle as image 1
- Dress the person in the "${productName}" garment from image 2
- Make the garment fit naturally with realistic:
  * Fabric drape and folds matching the person's pose
  * Lighting and shadows consistent with the scene
  * Proper sleeve length, collar, and fit on the body
- Remove any previous clothing in that area and replace with the new item
- The final image should look like a real professional fashion photo
- Output ONLY the composite image, no explanatory text`;
}

/**
 * Main virtual try-on generation function.
 * Returns the result including the generated image (data URL) or null on failure.
 */
export async function generateTryOn({
  userImage,
  productImage,
  productName,
}: TryOnParams): Promise<TryOnResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { image: null, detected: null, error: "No Gemini API key configured" };

  // --- Parse user image ---
  const user = stripDataUrl(userImage);

  // --- Load product image (URL or data URL) ---
  let product: { mimeType: string; data: string };
  if (productImage.startsWith("data:")) {
    product = stripDataUrl(productImage);
  } else {
    product = await fetchAsBase64(productImage);
  }

  // --- Step 1: Detect what the PRODUCT is ---
  let productType = "clothing";
  try {
    const detection = await detectContent(
      apiKey,
      product,
      `Look at this product image. In 3-5 words, what type of item is this? (e.g. "women's dress", "running shoes", "leather handbag", "men's jacket"). Be concise.`
    );
    productType = detection || "clothing";
    console.log(`[tryon] Detected product type: "${productType}"`);
  } catch (e) {
    console.warn("[tryon] Product detection failed, using default:", e);
  }

  // --- Step 2: Validate the user photo has a person ---
  try {
    const personCheck = await detectContent(
      apiKey,
      user,
      `Does this image show a person (human being)? Answer only YES or NO.`
    );
    if (personCheck.toUpperCase().startsWith("NO")) {
      return {
        image: null,
        detected: productType,
        error: "No person detected in the uploaded photo. Please upload a clear photo of yourself.",
      };
    }
    console.log("[tryon] Person confirmed in user photo.");
  } catch (e) {
    console.warn("[tryon] Person validation failed, proceeding anyway:", e);
  }

  // --- Step 3: Generate the composite try-on image ---
  const prompt = buildTryOnPrompt(productName, productType);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${apiKey}`;

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
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
        temperature: 1,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[tryon] API error ${res.status}:`, errText);
    
    // Parse the error for a cleaner message
    let apiError = `API returned ${res.status}`;
    try {
      const errJson = JSON.parse(errText);
      apiError = errJson?.error?.message ?? apiError;
    } catch { /* ignore */ }
    
    return { image: null, detected: productType, error: apiError };
  }

  const json = await res.json();
  const parts: Array<{
    text?: string;
    inlineData?: { mimeType: string; data: string };
  }> = json?.candidates?.[0]?.content?.parts ?? [];

  // Find the image part in the response
  for (const part of parts) {
    if (part.inlineData?.data) {
      const mime = part.inlineData.mimeType ?? "image/png";
      const imageDataUrl = `data:${mime};base64,${part.inlineData.data}`;
      console.log("[tryon] Generation successful, image received.");
      return { image: imageDataUrl, detected: productType };
    }
  }

  // No image in response — log what we did get
  const textParts = parts.filter((p) => p.text).map((p) => p.text);
  console.error("[tryon] No image in response. Text parts:", textParts);
  
  return {
    image: null,
    detected: productType,
    error: textParts.join(" ") || "Gemini did not return an image. Try with a clearer photo.",
  };
}
