'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Filter, Calendar, Activity } from 'lucide-react';
import { InspectionRecord } from '@/types/inspection';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Waves = dynamic(() => import('@/components/ui/Waves'), { ssr: false });

export default function ReportsPage() {
  const router = useRouter();
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInspections() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const { data } = await supabase
        .from('inspections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      let allRecords = data ? [...(data as InspectionRecord[])] : [];
      
      const localData = localStorage.getItem('local_inspections');
      if (localData) {
        try {
          const parsedArray = JSON.parse(localData);
          if (Array.isArray(parsedArray)) {
            parsedArray.forEach(parsed => {
              if (!allRecords.find(r => r.id === parsed.id || r.inspection_id === parsed.inspection_id)) {
                allRecords.unshift(parsed);
              }
            });
          }
        } catch(e) {}
      }
      
      setInspections(allRecords);
      setLoading(false);
    }
    fetchInspections();
  }, [router]);

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <Waves lineColor="rgba(99, 102, 241, 0.25)" backgroundColor="transparent" />
      </div>
      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-400" /> NovaWeave Reports
          </h1>
          <p className="text-zinc-400 mt-1">Export, review, and share automated inspection certificates.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300">
            <Calendar className="w-4 h-4 mr-2" /> Last 30 Days
          </Button>
        </div>
      </div>

      <Card className="bg-zinc-950/50 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-white">Generated Certificates</CardTitle>
          <CardDescription>All your scanned fabrics automatically generate enterprise PDF certificates.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-white/5 rounded-xl overflow-hidden bg-black/20">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-900/80 text-zinc-400 text-xs uppercase font-medium border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Report ID</th>
                  <th className="px-6 py-4">Date Generated</th>
                  <th className="px-6 py-4">Material</th>
                  <th className="px-6 py-4">Quality Score</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                      <div className="flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4 animate-spin" /> Loading reports vault...
                      </div>
                    </td>
                  </tr>
                ) : inspections.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                      No reports generated yet. Run a scan to create your first certificate.
                    </td>
                  </tr>
                ) : (
                  inspections.map((ins) => (
                    <tr key={ins.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 font-mono text-indigo-400">{ins.inspection_id}</td>
                      <td className="px-6 py-4">{new Date(ins.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4">{ins.material_prediction || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                          ins.quality >= 90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          ins.quality >= 70 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {ins.quality}/100
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          onClick={() => router.push(`/pdf/${ins.id}`)}
                          size="sm" 
                          variant="ghost" 
                          className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                          <Download className="w-4 h-4 mr-2" /> PDF
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
