import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// The Knowledge Base for the RAG system
const KNOWLEDGE_BASE = `
Welcome to the ThreadCounty Knowledge Base.
Platform Name: ThreadCounty
Purpose: AI-powered textile technology platform for analyzing fabric structures using Artificial Intelligence and Computer Vision.
Features: Fabric Image Upload, AI Analysis (Thread Density, Warp/Weft Count, Fabric Type, Weave Pattern, Quality Score), Upload History, Compare Fabrics, Admin Dashboard.
Pricing:
- Free: 5 uploads/month, Basic Density, Standard Support.
- Student: $9/mo, 50 uploads, Advanced AI, Weave Pattern, Priority Support.
- Professional: $49/mo, Unlimited, Premium AI, Defect Detection, 24/7 Support.
- Enterprise: Custom pricing, API access, Custom AI.
Definitions:
- Warp Count: The number of warp yarns (lengthwise) per inch.
- Weft Count: The number of weft yarns (crosswise) per inch.
- Quality Score: A metric out of 100 indicating the fabric's consistency and lack of defects.
- Thread Density: Total number of threads in a given area.
Contact: threadcounty@gmail.com
Location: DKTE Society's Textile & Engineering Institute, Ichalkaranji.
`;

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json();

    // RAG Implementation: Combine Knowledge Base + Current Context (User's specific analysis if any)
    let systemPrompt = `You are the ThreadCounty AI Assistant. You answer user questions about the platform and their fabric analysis. Use the following knowledge base: \n\n${KNOWLEDGE_BASE}\n\n`;
    
    if (context) {
      systemPrompt += `The user is currently looking at an analysis with these details: 
      Fabric Type: ${context.fabric_type}, Weave: ${context.weave_pattern}, Quality: ${context.quality_score}. Defect details: ${context.defects || 'None'}. Provide answers relevant to this context if asked.\n\n`;
    }
    
    systemPrompt += `Be concise, helpful, and professional. Do not invent features that are not listed in the knowledge base.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
      model: 'llama3-8b-8192',
    });

    return NextResponse.json({ answer: completion.choices[0]?.message?.content || 'No response generated.' });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
