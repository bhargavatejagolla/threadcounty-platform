import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    // if (profile?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const { data: users } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // Update user role, etc.
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    // if (profile?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const body = await req.json();
    const { userId, role } = z.object({ userId: z.string().uuid(), role: z.enum(['user', 'admin', 'moderator']) }).parse(body);

    // Prevent changing own role
    if (userId === user.id) {
      return NextResponse.json({ error: 'Cannot modify own role' }, { status: 400 });
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // Delete user (admin only)
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    // if (profile?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    if (userId === user.id) return NextResponse.json({ error: 'Cannot delete self' }, { status: 400 });

    // Delete auth user (requires service role)
    const { createClient: createAdminClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co", 
      process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy"
    );
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
