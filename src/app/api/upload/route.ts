import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { z } from "zod";

// Validation schema
const uploadSchema = z.object({
  file: z.instanceof(Blob).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Check authentication
    const supabase = await createClient(); // we need to make this async
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get file from FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 3. Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, JPEG allowed" },
        { status: 400 },
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 },
      );
    }

    // 4. Generate unique filename
    const ext = file.name.split(".").pop();
    const fileName = `${randomUUID()}.${ext}`;
    const filePath = `uploads/${user.id}/${fileName}`;

    // 5. Upload to Supabase Storage bucket 'fabric-images'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("fabric-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Upload to storage failed" },
        { status: 500 },
      );
    }

    // 6. Get public URL
    const { data: urlData } = supabase.storage
      .from("fabric-images")
      .getPublicUrl(filePath);
    const fileUrl = urlData.publicUrl;

    // 7. Insert record into uploads table
    const { data: uploadRecord, error: insertError } = await supabase
      .from("uploads")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_url: fileUrl,
        file_size: file.size,
        mime_type: file.type,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      // Optionally delete the uploaded file if DB insert fails
      await supabase.storage.from("fabric-images").remove([filePath]);
      console.error("DB insert error:", insertError);
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 },
      );
    }

    // 8. Trigger analysis asynchronously (or we can let the frontend call analysis separately)
    // We'll return the upload record and let frontend call /api/analyze with uploadId

    return NextResponse.json({
      success: true,
      upload: uploadRecord,
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
