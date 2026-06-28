import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { FeatureVector } from '@/types/inspection';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy-key',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { metrics, qualityScore, reliability, modelConfidence, material, pattern } = body;

    const prompt = `
You are NovaWeave AI, an enterprise textile computer vision analysis assistant.

You NEVER guess material types or patterns.
The NovaWeave Vision Engine has already deterministically classified this fabric.
Your job is to translate the classification and mathematical texture descriptors into professional manufacturing insights.

VISION ENGINE CLASSIFICATION (DO NOT CONTRADICT):
Material: ${material}
Pattern: ${pattern}

INPUT FEATURE VECTOR:
Entropy (Complexity): ${metrics.entropy}
Energy (Repetition): ${metrics.energy}
Homogeneity (Uniformity): ${metrics.homogeneity}
Contrast (Local Variations): ${metrics.contrast}
Correlation (Linear Dependency): ${metrics.correlation}
Edge Density: ${metrics.edge_density}
Dominant Orientation: ${metrics.orientation}°
Texture Variance: ${metrics.texture_variance}
FFT Peak (Periodicity): ${metrics.fft_peak}
Discontinuity Score (Anomalies): ${metrics.discontinuity_score}

COMPUTED SCORES (DO NOT CHANGE THESE):
Quality Score: ${qualityScore}/100
Inspection Reliability: ${reliability}%
Model Confidence: ${modelConfidence}%


STRICT RULES FOR YOUR OUTPUT:
1. Executive Summary:
- If Quality > 90, say "Excellent structural consistency"
- If Quality 70-90, say "Good structural consistency"
- If Quality 50-70, say "Moderate structural consistency"
- If Quality < 50, say "High structural variation"
Never contradict the numbers.

2. Metric Descriptions (Map dynamically based on values):
- Energy > 0.5 = "Strong repetitive pattern", > 0.2 = "Moderate repetitive pattern", else "Weak repetitive pattern"
- Homogeneity > 0.95 = "Highly Uniform", > 0.8 = "Very Uniform", > 0.6 = "Moderately Uniform", > 0.4 = "Mixed Texture", else "Highly Irregular"
- Orientation: Explain the angle (e.g. "Predominantly diagonal texture at ${metrics.orientation}°")

3. Recommendations (Generate conditionally):
- If Entropy is high (> 6.0): "Possible texture complexity. Inspect weave consistency."
- If Contrast is low (< 20): "Capture image under more uniform lighting."
- If Discontinuity is high (> 0.4): "High anomalies detected. Check for physical defects or stains."
Otherwise, recommend standard QA batch verification.

4. Confidence Reasoning:
Generate a breakdown tree explaining the Inspection Reliability (${reliability}%). Example:
"Inspection Reliability ${reliability}% based on:"
"├── Image Sharpness: Optimal"
"├── Lighting: Uniform"
"└── Noise: Minimal"

Produce machine-readable JSON only.

You must return ONLY a JSON object that perfectly matches this structure:
{
  "executive_summary": "string",
  "image_quality": "string",
  "confidence_reasoning": ["string", "string"],
  "recommendations": ["string", "string"],
  "limitations": ["string", "string"],
  "inspection_grade": "A or B or C or F",
  "risk_level": "Low or Medium or High"
}
    `;

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'dummy-key') {
      return NextResponse.json({
        executive_summary: qualityScore > 90 ? "Excellent structural consistency" : "Good structural consistency",
        image_quality: "Lighting and contrast are well-normalized for deep texture feature extraction.",
        confidence_reasoning: [
          `Inspection Reliability ${reliability}% based on:`,
          `├── Image Sharpness: ${metrics.edge_density > 0.05 ? 'Optimal' : 'Low'}`,
          `├── Lighting: ${metrics.contrast > 20 ? 'Uniform' : 'Uneven'}`,
          `└── Noise: Minimal`
        ],
        recommendations: [
          "Maintain current machine tension settings as structural variance is optimal.",
          "Proceed with standard QA batch verification."
        ],
        limitations: [
          "Optical texture analysis cannot detect sub-surface fiber compositions."
        ],
        inspection_grade: metrics.discontinuity_score > 0.5 ? "C" : "A",
        risk_level: metrics.discontinuity_score > 0.5 ? "Medium" : "Low"
      });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1, // Enterprise consistency
      response_format: { type: 'json_object' }
    });

    let resultString = chatCompletion.choices[0]?.message?.content || '{}';
    // Strip markdown formatting if Groq accidentally includes it
    resultString = resultString.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const result = JSON.parse(resultString);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Nova Summary Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
