import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeFabric } from "@/lib/ai/groq";
import { generatePDFReport } from "@/lib/pdf/generate";
import { z } from "zod";

const analyzeSchema = z.object({
  uploadId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse body
    const body = await req.json();
    const { uploadId } = analyzeSchema.parse(body);

    // 3. Fetch upload record, ensure it belongs to user
    const { data: upload, error: uploadError } = await supabase
      .from("uploads")
      .select("*")
      .eq("id", uploadId)
      .eq("user_id", user.id)
      .single();

    if (uploadError || !upload) {
      return NextResponse.json({ error: "Upload not found" }, { status: 404 });
    }

    // 4. Update status to processing
    await supabase
      .from("uploads")
      .update({ status: "processing" })
      .eq("id", uploadId);

    // 5. Call Groq AI
    let analysisResult;
    try {
      analysisResult = await analyzeFabric(upload.file_url);
    } catch (aiError: any) {
      // Mark as failed
      await supabase
        .from("uploads")
        .update({ status: "failed" })
        .eq("id", uploadId);
      return NextResponse.json(
        { error: "AI analysis failed: " + aiError.message },
        { status: 500 },
      );
    }

    // Ensure we have all expected fields
    const {
      fabricType = "Unknown",
      weavePattern = "Unknown",
      warpCount = 0,
      weftCount = 0,
      qualityScore = 0,
      confidenceScore = 0,
      defects = [],
      suggestions = [],
    } = analysisResult;

    // Compute thread density
    const threadDensity = warpCount + weftCount;

    // 6. Insert into analyses table
    const { data: analysisRecord, error: insertError } = await supabase
      .from("analyses")
      .insert({
        upload_id: uploadId,
        user_id: user.id,
        fabric_type: fabricType,
        weave_pattern: weavePattern,
        warp_count: warpCount,
        weft_count: weftCount,
        thread_density: threadDensity,
        quality_score: qualityScore,
        confidence_score: confidenceScore,
        defects: defects,
        ai_suggestions: suggestions.join("\n"),
        raw_ai_response: analysisResult,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Analysis insert error:", insertError);
      await supabase
        .from("uploads")
        .update({ status: "failed" })
        .eq("id", uploadId);
      return NextResponse.json(
        { error: "Failed to save analysis" },
        { status: 500 },
      );
    }

    // 7. Generate PDF report
    let reportUrl = null;
    try {
      const pdfBuffer = await generatePDFReport({
        imageUrl: upload.file_url,
        fabricType,
        weavePattern,
        warpCount,
        weftCount,
        threadDensity,
        qualityScore,
        confidenceScore,
        defects,
        suggestions,
        analysisId: analysisRecord.id,
        userName: user.email || "User",
      });
      // Upload PDF to Supabase storage
      const pdfFileName = `reports/${user.id}/${analysisRecord.id}.pdf`;
      const { data: pdfUpload, error: pdfError } = await supabase.storage
        .from("reports")
        .upload(pdfFileName, pdfBuffer, {
          contentType: "application/pdf",
          cacheControl: "3600",
        });
      if (!pdfError) {
        const { data: pdfPublic } = supabase.storage
          .from("reports")
          .getPublicUrl(pdfFileName);
        reportUrl = pdfPublic.publicUrl;
        // Update analysis with report_url
        await supabase
          .from("analyses")
          .update({ report_url: reportUrl })
          .eq("id", analysisRecord.id);
      }
    } catch (pdfError) {
      console.error("PDF generation error:", pdfError);
      // Non‑fatal, we still have analysis
    }

    // 8. Update upload status to completed
    await supabase
      .from("uploads")
      .update({ status: "completed" })
      .eq("id", uploadId);

    // 9. Increment user's total_uploads
    await supabase.rpc("increment_upload_count", { user_id: user.id }); // we'll create this function

    // 10. Create notification for user
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "analysis_complete",
      title: "Analysis Complete",
      message: `Your analysis for ${upload.file_name} is ready!`,
      link: `/analysis/${analysisRecord.id}`,
    });

    return NextResponse.json({
      success: true,
      analysis: analysisRecord,
    });
  } catch (error: any) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
