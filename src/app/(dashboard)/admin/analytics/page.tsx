// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { Users, Activity, Settings, ShieldCheck, Database, ArrowUpRight, TrendingUp } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dynamic from 'next/dynamic';

const ColorBends = dynamic(() => import('@/components/ui/ColorBends'), { ssr: false });
const AnyResponsiveContainer = ResponsiveContainer as any;

interface Stats {
  totalUsers: number;
  totalUploads: number;
  totalAnalyses: number;
  storageUsed: number;
  usersByDay: { created_at: string }[];
  uploadsByDay: { created_at: string }[];
  fabricDistribution: { name: string; count: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!stats) return <p>Failed to load analytics.</p>;

  // Prepare chart data
  const usersByDayData = (stats.usersByDay || []).reduce((acc: any, curr) => {
    const date = new Date(curr.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const usersData = Object.entries(usersByDayData).map(([date, count]) => ({ date, count }));

  const uploadsByDayData = (stats.uploadsByDay || []).reduce((acc: any, curr) => {
    const date = new Date(curr.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const uploadsData = Object.entries(uploadsByDayData).map(([date, count]) => ({ date, count }));

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={90}
          speed={0.1}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.1}
          parallax={0.5}
          iterations={1}
          intensity={1.2}
          bandWidth={6}
          transparent
          autoRotate={0}
        />
      </div>
      <div className="p-6 max-w-6xl mx-auto space-y-6 relative z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">Platform Analytics</h1>
          <p className="text-zinc-400 mt-1">Platform-wide usage and data trends.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-950/50 border-white/10 backdrop-blur-sm"><CardHeader><CardTitle>Total Users</CardTitle></CardHeader><CardContent><p className="text-3xl">{stats.totalUsers}</p></CardContent></Card>
          <Card className="bg-zinc-950/50 border-white/10 backdrop-blur-sm"><CardHeader><CardTitle>Total Uploads</CardTitle></CardHeader><CardContent><p className="text-3xl">{stats.totalUploads}</p></CardContent></Card>
          <Card className="bg-zinc-950/50 border-white/10 backdrop-blur-sm"><CardHeader><CardTitle>Total Analyses</CardTitle></CardHeader><CardContent><p className="text-3xl">{stats.totalAnalyses}</p></CardContent></Card>
          <Card className="bg-zinc-950/50 border-white/10 backdrop-blur-sm"><CardHeader><CardTitle>Storage Used</CardTitle></CardHeader><CardContent><p className="text-3xl">{ (stats.storageUsed / (1024*1024)).toFixed(2) } MB</p></CardContent></Card>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Users (last 30 days)</CardTitle></CardHeader>
          <CardContent>
            <AnyResponsiveContainer width="100%" height={250}>
              <LineChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </AnyResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Uploads (last 30 days)</CardTitle></CardHeader>
          <CardContent>
            <AnyResponsiveContainer width="100%" height={250}>
              <BarChart data={uploadsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </AnyResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-950/50 border-white/10 backdrop-blur-sm">
        <CardHeader><CardTitle>Fabric Type Distribution</CardTitle></CardHeader>
        <CardContent>
          <AnyResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.fabricDistribution} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {stats.fabricDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </AnyResponsiveContainer>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
