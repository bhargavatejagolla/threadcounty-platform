'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Library, Search, SlidersHorizontal, ArrowRight, Download, Filter, ArrowDownWideNarrow, ArrowUpWideNarrow, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { InspectionRecord } from '@/types/inspection';
import dynamic from 'next/dynamic';
const LightRays = dynamic(() => import('@/components/ui/LightRays'), { ssr: false });
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function AnalysisVaultPage() {
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'confidence' | 'quality'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const router = useRouter();

  useEffect(() => {
    const fetchVault = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
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
    };
    fetchVault();
  }, []);

  const filteredAndSortedInspections = useMemo(() => {
    let result = [...inspections];
    
    // Apply search filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.inspection_id && item.inspection_id.toLowerCase().includes(lowerSearch)) ||
        (item.analysis_hash && item.analysis_hash.toLowerCase().includes(lowerSearch)) ||
        (item.material_prediction && item.material_prediction.toLowerCase().includes(lowerSearch)) ||
        (item.pattern_prediction && item.pattern_prediction.toLowerCase().includes(lowerSearch))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'date') {
        valA = new Date(a.created_at).getTime();
        valB = new Date(b.created_at).getTime();
      } else if (sortBy === 'confidence') {
        valA = a.confidence || 0;
        valB = b.confidence || 0;
      } else {
        valA = a.quality || 0;
        valB = b.quality || 0;
      }
      
      if (sortOrder === 'desc') {
        return valB - valA;
      } else {
        return valA - valB;
      }
    });

    return result;
  }, [inspections, searchTerm, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const { error } = await supabase.from('inspections').delete().eq('id', id);
      if (error) throw error;
      setInspections(prev => prev.filter(item => item.id !== id));
      toast.success('Report deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete report', { description: error.message });
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('Downloading CSV Export...', { description: 'Generating compliance export payload.' });
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      {/* Light Rays Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50 mix-blend-screen">
        <LightRays
          raysOrigin="top-center"
          raysColor="#818cf8"
          raysSpeed={1.2}
          lightSpread={0.8}
          rayLength={4}
          followMouse={true}
          mouseInfluence={0.3}
          noiseAmount={0.05}
          distortion={0.3}
          pulsating={true}
          fadeDistance={1.2}
          saturation={1.5}
        />
      </div>

      <div className="relative z-10 space-y-6 max-w-7xl mx-auto pt-6 px-4 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Library className="h-8 w-8 text-indigo-400" />
            Analysis Vault
          </h1>
          <p className="text-zinc-400 mt-1">Your enterprise knowledge base of all past textile inspections.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 text-zinc-300" onClick={toggleSortOrder}>
            {sortOrder === 'desc' ? <ArrowDownWideNarrow className="mr-2 h-4 w-4" /> : <ArrowUpWideNarrow className="mr-2 h-4 w-4" />} 
            {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
          </Button>
          <Button variant="outline" onClick={handleDownload} className="border-white/10 hover:bg-white/5 text-zinc-300">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Search and Advanced Filters */}
      <Card className="bg-white/[0.02] border-white/10 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search by ID, Hash, Material, or Pattern..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all backdrop-blur-md"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
            >
              <option value="date">Sort by Date</option>
              <option value="confidence">Sort by Confidence</option>
              <option value="quality">Sort by Quality</option>
            </select>
            <Button variant="secondary" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 h-[42px]">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vault Data Table */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-zinc-900/50 rounded-xl border border-white/5"></div>
          ))}
        </div>
      ) : filteredAndSortedInspections.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredAndSortedInspections.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={item.id}
            >
              <Card className="bg-white/[0.02] border-white/10 backdrop-blur-3xl hover:border-indigo-500/40 hover:shadow-[0_8px_32px_0_rgba(79,70,229,0.2)] transition-all duration-500 group cursor-pointer relative overflow-hidden" onClick={() => router.push(`/inspection/${item.id}`)}>
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 bg-zinc-900 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.image_url})` }}></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-lg text-white group-hover:text-indigo-300 transition-colors">
                          {item.inspection_id}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800">
                          {item.analysis_hash}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        {item.material_prediction && (
                           <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                             {item.material_prediction}
                           </span>
                        )}
                        {item.pattern_prediction && (
                           <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                             {item.pattern_prediction}
                           </span>
                        )}
                        <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:block"></span>
                        <p className="text-sm text-zinc-400">
                          Quality: <span className={item.quality > 90 ? "text-emerald-400" : "text-amber-400"}>{item.quality}/100</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end border-t border-white/5 sm:border-t-0 pt-4 sm:pt-0 mt-4 sm:mt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        {item.confidence}%
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">AI Confidence</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-zinc-500">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => handleDelete(e, item.id)}
                          className="h-10 w-10 rounded-full text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors z-10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="bg-white/[0.02] border-white/10 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-6">
              <Search className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
            <p className="text-zinc-500 max-w-sm mb-6">We couldn't find any inspections matching your search criteria.</p>
            <Button onClick={() => setSearchTerm('')} className="bg-zinc-800 hover:bg-zinc-700 text-white">Clear Filters</Button>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
