import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get profile stats
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_uploads, storage_used, subscription_tier')
      .eq('id', user.id)
      .single();

    // Get analyses count this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const { count: monthlyAnalyses } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString());

    // Get recent activity (last 5 analyses)
    const { data: recentActivity } = await supabase
      .from('analyses')
      .select(`
        id,
        created_at,
        fabric_type,
        uploads ( file_name )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get storage limit (mock – we can set a limit based on subscription)
    const storageLimit = profile?.subscription_tier === 'free' ? 500 * 1024 * 1024 : 2 * 1024 * 1024 * 1024;

    return NextResponse.json({
      totalUploads: profile?.total_uploads || 0,
      monthlyAnalyses: monthlyAnalyses || 0,
      storageUsed: profile?.storage_used || 0,
      storageLimit,
      recentActivity: recentActivity || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
