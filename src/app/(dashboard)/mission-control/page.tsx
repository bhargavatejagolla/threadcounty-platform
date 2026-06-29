'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ScanSearch, Activity, Database, CheckCircle2, ArrowRight, Sparkles, Cpu, Clock, Layers,
  TrendingUp, TrendingDown, Target, Zap, MoreVertical, ShieldCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import StarBorder from '@/components/ui/StarBorder';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line
} from 'recharts';
import { InspectionRecord } from '@/types/inspection';

const sparklineData1 = [{ v: 20 }, { v: 30 }, { v: 25 }, { v: 45 }, { v: 40 }, { v: 60 }];
const sparklineData2 = [{ v: 90 }, { v: 92 }, { v: 95 }, { v: 93 }, { v: 98 }, { v: 99.2 }];
const sparklineData3 = [{ v: 10 }, { v: 12 }, { v: 11 }, { v: 14 }, { v: 13 }, { v: 16 }];
const sparklineData4 = [{ v: 3.5 }, { v: 3.2 }, { v: 2.8 }, { v: 3.0 }, { v: 2.4 }, { v: 2.1 }];

export default function MissionControlPage() {
  const router = useRouter();
  const [userFullName, setUserFullName] = useState('Inspector');
  const [greeting, setGreeting] = useState('Welcome back');
  const [loading, setLoading] = useState(true);
  
  // Real DB State
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    avgConfidence: 0,
    avgInference: 0,
    avgReliability: 0
  });

  const [mainChartData, setMainChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      // Determine greeting based on local time
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 17) setGreeting('Good Afternoon');
      else if (hour < 21) setGreeting('Good Evening');
      else setGreeting('Good Night');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
        
      if (profile && profile.full_name) {
        setUserFullName(profile.full_name);
      } else if (user.email) {
        setUserFullName(user.email.split('@')[0]);
      }

      // Fetch unified inspections from DB
      const { data: dbInspections } = await supabase
        .from('inspections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      let allRecords = dbInspections ? [...(dbInspections as InspectionRecord[])] : [];
      
      // Merge local fallback data if it exists (so the user sees it even if DB failed)
      const localData = localStorage.getItem('local_inspection');
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (!allRecords.find(r => r.id === parsed.id || r.inspection_id === parsed.inspection_id)) {
            allRecords.unshift(parsed); // Put the local scan at the top
          }
        } catch(e) {
          console.error(e);
        }
      }

      setInspections(allRecords);

      if (allRecords.length > 0) {
        // Calculate dynamic stats
        const total = allRecords.length;
        const sumConf = allRecords.reduce((acc, curr) => acc + (curr.confidence || 0), 0);
        const sumTime = allRecords.reduce((acc, curr) => acc + (curr.processing_time || 0), 0);
        const sumRel = allRecords.reduce((acc, curr) => acc + (curr.reliability || 0), 0);
        
        setStats({
          total,
          avgConfidence: sumConf / total,
          avgInference: sumTime / total,
          avgReliability: sumRel / total
        });

        // 1. Generate Main Chart Data (Confidence Over Time)
        const recent = [...allRecords].reverse(); // Oldest first for line chart
        setMainChartData(recent.slice(-10).map((r, i) => ({
          name: "Scan " + (i+1),
          confidence: r.confidence || 0,
          quality: r.quality || 0
        })));

        // 2. Generate Pie Data (Inspection Grades Distribution)
        const grades = { A: 0, B: 0, C: 0, F: 0 };
        allRecords.forEach(r => {
          if (r.inspection_grade === 'A') grades.A++;
          else if (r.inspection_grade === 'B') grades.B++;
          else if (r.inspection_grade === 'C') grades.C++;
          else if (r.inspection_grade === 'F') grades.F++;
        });
        
        const newPieData = [
          { name: 'Grade A', value: grades.A, color: '#10b981' },
          { name: 'Grade B', value: grades.B, color: '#3b82f6' },
          { name: 'Grade C', value: grades.C, color: '#f59e0b' },
          { name: 'Grade F', value: grades.F, color: '#ef4444' },
        ].filter(d => d.value > 0);
        
        // Ensure pie has at least something if no grades exist
        setPieData(newPieData.length > 0 ? newPieData : [{ name: 'Ungraded', value: 1, color: '#6b7280' }]);

        // 3. Generate Radar Data (Average Texture Metrics)
        const avgEntropy = allRecords.reduce((acc, curr) => acc + (curr.entropy || 0), 0) / total;
        const avgEnergy = allRecords.reduce((acc, curr) => acc + (curr.energy || 0), 0) / total;
        const avgHomogeneity = allRecords.reduce((acc, curr) => acc + (curr.homogeneity || 0), 0) / total;
        const avgContrast = allRecords.reduce((acc, curr) => acc + (curr.contrast || 0), 0) / total;
        const avgDiscontinuity = allRecords.reduce((acc, curr) => acc + (curr.discontinuity_score || 0), 0) / total;

        setRadarData([
          { subject: 'Entropy', A: Math.min(100, avgEntropy * 15), fullMark: 100 },
          { subject: 'Energy', A: Math.min(100, avgEnergy * 100), fullMark: 100 },
          { subject: 'Homogeneity', A: Math.min(100, avgHomogeneity * 100), fullMark: 100 },
          { subject: 'Contrast', A: Math.min(100, avgContrast), fullMark: 100 },
          { subject: 'Stability', A: Math.max(0, 100 - (avgDiscontinuity * 100)), fullMark: 100 },
        ]);
      } else {
        // Fallback empty charts if absolutely 0 records
        setMainChartData([{ name: 'No Data', confidence: 0, quality: 0 }]);
        setPieData([{ name: 'No Scans', value: 1, color: '#3f3f46' }]);
        setRadarData([
          { subject: 'Entropy', A: 0, fullMark: 100 },
          { subject: 'Energy', A: 0, fullMark: 100 },
          { subject: 'Homogeneity', A: 0, fullMark: 100 },
          { subject: 'Contrast', A: 0, fullMark: 100 },
          { subject: 'Stability', A: 0, fullMark: 100 },
        ]);
      }
      setLoading(false);
    }
    fetchData();
  }, [router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) return null;

  return (
    <motion.div 
      className="space-y-6 relative z-10 max-w-[1600px] mx-auto pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-indigo-600/10 blur-[120px] pointer-events-none z-0 rounded-full"></div>

      {/* Header */}
      <motion.div variants={itemVariants} className="relative z-10 flex flex-col pt-4">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          {greeting}, {userFullName.split(' ')[0]} <span className="animate-wave text-2xl">👋</span>
        </h1>
        <p className="text-zinc-400 mt-1">Here's what's happening with your fabric analyses today.</p>
      </motion.div>

      {/* Stat Cards Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        
        {/* Card 1 */}
        <SpotlightCard className="group" spotlightColor="rgba(168, 85, 247, 0.15)">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <Activity className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Total Analyses</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Live Sync
              </p>
              <div className="h-8 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData1}>
                    <Line type="monotone" dataKey="v" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </SpotlightCard>

        {/* Card 2 */}
        <SpotlightCard className="group" spotlightColor="rgba(59, 130, 246, 0.15)">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                  <Target className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Accuracy Rate</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{stats.avgConfidence.toFixed(1)}%</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Real-time
              </p>
              <div className="h-8 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData2}>
                    <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </SpotlightCard>

        {/* Card 3 */}
        <SpotlightCard className="group" spotlightColor="rgba(20, 184, 166, 0.15)">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                  <Layers className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Fabrics Scanned</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Total Items
              </p>
              <div className="h-8 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData3}>
                    <Line type="monotone" dataKey="v" stroke="#14b8a6" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </SpotlightCard>

        {/* Card 4 */}
        <SpotlightCard className="group" spotlightColor="rgba(236, 72, 153, 0.15)">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
                  <Zap className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Avg. Inference</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{stats.avgInference.toFixed(2)}s</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-xs font-medium text-pink-400 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" /> Speed optimized
              </p>
              <div className="h-8 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData4}>
                    <Line type="monotone" dataKey="v" stroke="#ec4899" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </SpotlightCard>

      </motion.div>

      {/* Middle Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Main Chart */}
        <Card className="lg:col-span-2 bg-zinc-950/80 border-white/5 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
            <div>
              <CardTitle className="text-sm font-semibold text-white tracking-wide">Analysis Overview (Recent Scans)</CardTitle>
            </div>
            <div className="px-3 py-1 rounded bg-zinc-900 border border-white/10 text-xs text-zinc-300 font-medium cursor-pointer flex items-center gap-2">
              Recent <ChevronDown className="w-3 h-3 text-zinc-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mainChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorQual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="confidence" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorConf)" name="Confidence" />
                  <Area type="monotone" dataKey="quality" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorQual)" name="Quality Score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-4 ml-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                <span className="text-xs text-zinc-400 font-medium">Confidence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                <span className="text-xs text-zinc-400 font-medium">Quality Score</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Analyses List (REAL DATA) */}
        <Card className="bg-zinc-950/80 border-white/5 backdrop-blur-xl flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
            <CardTitle className="text-sm font-semibold text-white tracking-wide">Recent Analyses</CardTitle>
            <button onClick={() => router.push('/vault')} className="text-xs font-medium text-zinc-400 hover:text-white flex items-center transition-colors">
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
            <div className="divide-y divide-white/5 overflow-y-auto max-h-[340px] px-2 py-2">
              {inspections.slice(0, 5).map((item) => (
                <div key={item.id} onClick={() => router.push(`/inspection/${item.id}`)} className="flex items-center justify-between p-3 hover:bg-white/[0.03] rounded-lg transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded overflow-hidden border border-white/10 relative shrink-0">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.image_url})` }}></div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors">{item.inspection_id}</p>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Homogeneity {((item.homogeneity || 0) * 100).toFixed(0)}% • Angle {item.orientation || 0}°</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-2 py-0.5 rounded border text-[10px] font-mono shadow-[0_0_10px_rgba(16,185,129,0.1)] ${item.confidence > 90 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {item.confidence}%
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-medium text-zinc-300">{item.processing_time}s</p>
                      <p className="text-[9px] text-zinc-600">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</p>
                    </div>
                    <button className="text-zinc-600 hover:text-zinc-300 transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {inspections.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <ScanSearch className="h-8 w-8 text-zinc-600 mb-3" />
                  <p className="text-sm text-zinc-400">No inspections found in Vault.</p>
                  <Button variant="link" onClick={() => router.push('/scanner')} className="text-indigo-400 mt-2">Run First Scan</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Donut Chart */}
        <Card className="bg-zinc-950/80 border-white/5 backdrop-blur-xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-semibold text-white tracking-wide">Inspection Quality Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col items-center">
            <div className="h-[200px] w-full flex justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff20', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-2xl font-bold text-white tracking-tight">{stats.total}</p>
                <p className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Total Scans</p>
              </div>
            </div>
            
            {/* Custom List Legend */}
            <div className="w-full grid grid-cols-2 gap-y-3 gap-x-2 mt-4 px-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: item.color, color: item.color }}></div>
                    <span className="text-xs text-zinc-400">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
            
            <button className="text-xs text-zinc-400 hover:text-white flex items-center mt-6 mb-2 transition-colors">
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card className="bg-zinc-950/80 border-white/5 backdrop-blur-xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-semibold text-white tracking-wide">Average Texture Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col items-center">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#ffffff15" />
                  {/* @ts-ignore */}
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                  {/* @ts-ignore */}
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Average Scans" dataKey="A" stroke="#a855f7" strokeWidth={2} fill="#a855f7" fillOpacity={0.3} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff20', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <button className="text-xs text-zinc-400 hover:text-white flex items-center mt-6 mb-2 transition-colors">
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          </CardContent>
        </Card>

        {/* CTA Card */}
        <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/20 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <CardContent className="p-8 h-full flex flex-col justify-center relative z-10">
            <div className="mb-6">
              <Sparkles className="h-6 w-6 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AI Model v2.1 is Here!</h3>
              <p className="text-sm text-zinc-300 leading-relaxed max-w-[200px]">
                Better accuracy, faster inference and improved texture metric recognition based on GLCM approximations.
              </p>
            </div>
            <StarBorder as="button" color="#a855f7" speed="4s" className="w-fit text-sm font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 border-none p-0">
              <span className="flex items-center">Explore What's New <ArrowRight className="ml-2 h-4 w-4" /></span>
            </StarBorder>
            
            <div className="absolute -bottom-10 -right-10 opacity-30 group-hover:opacity-60 transition-opacity duration-500 blur-[2px]">
              <div className="h-40 w-40 border border-indigo-500/30 rounded-xl rotate-12 flex items-center justify-center bg-indigo-500/5">
                <div className="h-28 w-28 border border-purple-500/30 rounded-xl -rotate-6 bg-purple-500/5 flex items-center justify-center">
                  <span className="font-black text-6xl text-white/20">AI</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// Simple internal icon (since ChevronDown wasn't imported initially)
function ChevronDown(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}