import Groq from "groq-sdk";

// Singleton instance
let groqInstance: Groq | null = null;

export function getGroqClient(): Groq {
  if (!groqInstance) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not set");
    groqInstance = new Groq({ apiKey });
  }
  return groqInstance;
}

/**
 * Analyze fabric image using Groq's Llama 3.2 90B Vision model.
 * @param imageUrl - Public URL of the image stored in Supabase
 * @returns Parsed analysis result
 */
export async function analyzeFabric(imageUrl: string) {
  const client = getGroqClient();

  const prompt = `You are an expert textile analyst. Examine the provided fabric image and return a JSON object with the following keys:
- fabricType: string (e.g., "Cotton", "Silk", "Polyester", "Wool", "Linen", etc.)
- weavePattern: string (e.g., "Plain", "Twill", "Satin", "Jacquard")
- warpCount: number (threads per inch in warp direction, estimate)
- weftCount: number (threads per inch in weft direction, estimate)
- qualityScore: number (0-100, based on apparent quality)
- confidenceScore: number (0-100, your confidence in the analysis)
- defects: array of strings (any visible defects, e.g., "stain", "hole", "uneven weave")
- suggestions: array of strings (recommendations for improvement)

Return ONLY valid JSON, no extra text.`;

  // For vision, we need to include the image as base64 or URL
  // Groq vision supports image URLs (publicly accessible) or base64.
  // We'll pass the image URL directly (must be publicly accessible).
  const response = await client.chat.completions.create({
    model: "llama-3.2-90b-vision-preview", // or 'llama-3.2-90b-vision'
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
    temperature: 0.2,
    max_tokens: 1024,
    response_format: { type: "json_object" }, // supported by Groq?
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content in Groq response");

  // Parse JSON safely
  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error("Failed to parse Groq JSON response: " + content);
  }
}
