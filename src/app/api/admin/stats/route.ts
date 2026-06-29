import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // For Hackathon Demo: Allow all authenticated users to view the admin dashboard
    // In production, we would enforce: if (profile?.role !== 'admin') return 403;

    // Total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Total uploads
    const { count: totalUploads } = await supabase
      .from('uploads')
      .select('*', { count: 'exact', head: true });

    // Total analyses
    const { count: totalAnalyses } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true });

    // Storage used (sum of file_size in uploads)
    const { data: storageData } = await supabase
      .from('uploads')
      .select('file_size');
    const storageUsed = storageData?.reduce((acc, cur) => acc + cur.file_size, 0) || 0;

    // Users over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data: usersByDay } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // Uploads over time (last 30 days)
    const { data: uploadsByDay } = await supabase
      .from('uploads')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // Fabric type distribution
    const { data: fabricDistribution } = await supabase
      .from('analyses')
      .select('fabric_type')
      .not('fabric_type', 'is', null);

    const fabricCounts: Record<string, number> = {};
    fabricDistribution?.forEach(item => {
      const type = item.fabric_type || 'Unknown';
      fabricCounts[type] = (fabricCounts[type] || 0) + 1;
    });

    return NextResponse.json({
      totalUsers,
      totalUploads,
      totalAnalyses,
      storageUsed,
      usersByDay,
      uploadsByDay,
      fabricDistribution: Object.entries(fabricCounts).map(([name, count]) => ({ name, count })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
