import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  fabricType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const params = querySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      fabricType: searchParams.get('fabricType'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
    });

    let query = supabase
      .from('analyses')
      .select(`
        id,
        fabric_type,
        weave_pattern,
        quality_score,
        confidence_score,
        created_at,
        uploads ( file_name, file_url )
      `, { count: 'exact' })
      .eq('user_id', user.id);

    // Apply filters
    if (params.search) {
      query = query.ilike('uploads.file_name', `%${params.search}%`);
    }
    if (params.fabricType) {
      query = query.eq('fabric_type', params.fabricType);
    }
    if (params.startDate) {
      query = query.gte('created_at', params.startDate);
    }
    if (params.endDate) {
      query = query.lte('created_at', params.endDate);
    }

    // Pagination
    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return NextResponse.json({
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / params.limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing analysis ID' }, { status: 400 });
    }

    // Check ownership
    const { data: analysis } = await supabase
      .from('analyses')
      .select('id, upload_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!analysis) {
      return NextResponse.json({ error: 'Not found or not owned' }, { status: 404 });
    }

    // Delete associated upload (cascade will delete analysis due to foreign key)
    // But we also need to delete the file from storage
    // First get upload record to get file path
    const { data: upload } = await supabase
      .from('uploads')
      .select('file_url')
      .eq('id', analysis.upload_id)
      .single();

    if (upload) {
      // Extract path from URL (assuming public URL)
      const url = new URL(upload.file_url);
      const path = url.pathname.split('/').slice(3).join('/'); // adjust based on bucket
      // Remove from storage
      await supabase.storage.from('fabric-images').remove([path]);
    }

    // Delete the analysis (cascade deletes upload due to foreign key)
    const { error } = await supabase
      .from('analyses')
      .delete()
      .eq('id', id);
    if (error) throw error;

    // Also update profile total_uploads (decrement)
    await supabase.rpc('decrement_upload_count', { user_id: user.id }); // we'll create this

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
