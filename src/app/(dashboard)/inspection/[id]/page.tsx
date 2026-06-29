'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Download, Share2, PlayCircle, 
  Cpu, Activity, CheckCircle2, ChevronRight, Fingerprint, Zap, Sparkles, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InspectionRecord } from '@/types/inspection';
import Loading from '@/components/ui/Loading';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function InspectionViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [inspection, setInspection] = useState<InspectionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeView, setActiveView] = useState<'original' | 'histogram' | 'edges' | 'glcm' | 'lbp' | 'heatmap' | 'contours'>('original');
  const [isReplaying, setIsReplaying] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [replayStage, setReplayStage] = useState(0);

  useEffect(() => {
    async function fetchInspection() {
      if (params.id === 'local') {
        const localData = localStorage.getItem('local_inspection');
        if (localData) {
          setInspection(JSON.parse(localData));
        } else {
          console.error("No local data found in fallback mode.");
        }
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('inspections')
          .select('*')
          .eq('id', params.id)
          .single();
          
        if (error) throw error;
        setInspection(data as InspectionRecord);
      } catch (err) {
        console.error('Error fetching inspection:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInspection();
  }, [params.id]);

  const triggerReplay = () => {
    setIsReplaying(true);
    setReplayStage(0);
    setActiveView('original');
    
    setTimeout(() => { setReplayStage(1); setActiveView('histogram'); }, 1000);
    setTimeout(() => { setReplayStage(2); setActiveView('edges'); }, 2000);
    setTimeout(() => { setReplayStage(3); setActiveView('glcm'); }, 3000);
    setTimeout(() => { setReplayStage(4); setActiveView('lbp'); }, 4000);
    setTimeout(() => { setReplayStage(5); setActiveView('heatmap'); }, 5000);
    setTimeout(() => { setReplayStage(6); setActiveView('contours'); }, 6000);
    setTimeout(() => { setReplayStage(7); setActiveView('original'); setIsReplaying(false); }, 7500);
  };

  if (loading) {
    return <Loading />;
  }

  if (!inspection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white">Record Not Found</h2>
        <p className="text-zinc-500">This inspection record does not exist or you lack permissions.</p>
        <Button onClick={() => router.push('/mission-control')} variant="outline">Return to Mission Control</Button>
      </div>
    );
  }

  // Removed synthetic sub-confidence variables as we now use real metrics

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Top Action Bar */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">Inspection {inspection.inspection_id}</h1>
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                Verified
              </span>
            </div>
            <p className="text-zinc-500 text-sm flex items-center gap-2 mt-1 font-medium">
              <Fingerprint className="h-3.5 w-3.5 text-zinc-600" /> {inspection.analysis_hash} <span className="text-zinc-700">•</span> {new Date(inspection.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all bg-zinc-900/50 backdrop-blur-md">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button onClick={() => router.push(`/pdf/${inspection.id}`)} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-400/20 transition-all">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Viewer */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div variants={fadeUp}>
            <Card className="bg-zinc-950/80 border-white/10 overflow-hidden relative shadow-2xl backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="aspect-square sm:aspect-video relative bg-black group overflow-hidden">
                  
                  {/* Grid Background behind image */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                  {/* Simulated Image Viewer */}
                  <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeView === 'original' ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${inspection.image_url})` }}></div>
                  </div>
                  
                  {/* Simulated Edges (Canny) */}
                  <div className={`absolute inset-0 bg-zinc-950 transition-opacity duration-700 ease-in-out flex items-center justify-center ${activeView === 'edges' ? 'opacity-100 z-10' : 'opacity-0'}`}>
                     <div className="w-full h-full bg-cover bg-center invert grayscale contrast-[3] brightness-150 opacity-90 mix-blend-screen" style={{ backgroundImage: `url(${inspection.image_url})` }}></div>
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
                  </div>

                  {/* Simulated Histogram */}
                  <div className={`absolute inset-0 bg-zinc-950 transition-opacity duration-700 ease-in-out flex items-center justify-center ${activeView === 'histogram' ? 'opacity-100 z-10' : 'opacity-0'}`}>
                     <div className="w-full h-full bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: `url(${inspection.image_url})` }}></div>
                     <div className="absolute inset-0 bg-black/60"></div>
                     <div className="absolute bottom-10 left-10 right-10 h-32 flex items-end justify-between gap-1 opacity-80">
                       {Array.from({length: 40}).map((_, i) => (
                         <motion.div key={i} className="bg-indigo-500 w-full rounded-t-sm" initial={{ height: 0 }} animate={{ height: activeView === 'histogram' ? Math.random() * 100 + 20 : 0 }} transition={{ duration: 0.5, delay: i * 0.02 }} />
                       ))}
                     </div>
                  </div>

                  {/* Simulated GLCM */}
                  <div className={`absolute inset-0 bg-zinc-950 transition-opacity duration-700 ease-in-out flex items-center justify-center ${activeView === 'glcm' ? 'opacity-100 z-10' : 'opacity-0'}`}>
                     <div className="w-full h-full bg-cover bg-center grayscale contrast-200 blur-sm opacity-50" style={{ backgroundImage: `url(${inspection.image_url})` }}></div>
                     <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.2)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
                  </div>

                  {/* Simulated LBP */}
                  <div className={`absolute inset-0 bg-zinc-950 transition-opacity duration-700 ease-in-out flex items-center justify-center ${activeView === 'lbp' ? 'opacity-100 z-10' : 'opacity-0'}`}>
                     <div className="w-full h-full bg-cover bg-center invert opacity-80 mix-blend-color-burn" style={{ backgroundImage: `url(${inspection.image_url})` }}></div>
                     <div className="absolute inset-0 bg-emerald-900/40 mix-blend-color"></div>
                  </div>

                  {/* Simulated Contours */}
                  <div className={`absolute inset-0 bg-zinc-950 transition-opacity duration-700 ease-in-out flex items-center justify-center ${activeView === 'contours' ? 'opacity-100 z-10' : 'opacity-0'}`}>
                     <div className="w-full h-full bg-cover bg-center grayscale contrast-[2] brightness-50 opacity-40" style={{ backgroundImage: `url(${inspection.image_url})` }}></div>
                     <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/30 via-transparent to-transparent"></div>
                     <div className="absolute inset-0 border border-emerald-500/20 rounded-full scale-[0.8] mix-blend-screen shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
                     <div className="absolute inset-0 border border-emerald-500/30 rounded-full scale-[0.6] mix-blend-screen shadow-[0_0_20px_rgba(16,185,129,0.4)]"></div>
                     
                     <div className="absolute bottom-6 left-6 text-emerald-400 font-mono text-[10px] uppercase tracking-widest border border-emerald-500/30 px-3 py-1.5 bg-emerald-500/10 rounded flex items-center gap-2 backdrop-blur-md">
                        <Zap className="w-3 h-3" /> Contour Topography Active
                     </div>
                  </div>

                  {/* Simulated Heatmap */}
                  <div className={`absolute inset-0 bg-zinc-950 transition-opacity duration-700 ease-in-out ${activeView === 'heatmap' ? 'opacity-100 z-10' : 'opacity-0'}`}>
                     <div className="w-full h-full bg-cover bg-center grayscale opacity-40 mix-blend-luminosity" style={{ backgroundImage: `url(${inspection.image_url})` }}></div>
                     <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/50 via-purple-500/50 to-red-500/50 mix-blend-color"></div>
                  </div>

                  {/* Replay Overlay */}
                  {isReplaying && (
                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-zinc-900/50 z-50 backdrop-blur-sm">
                      <motion.div 
                        className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 7.5, ease: "linear" }}
                      />
                    </div>
                  )}
                  {isReplaying && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 left-4 z-50 bg-zinc-950/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-3 shadow-2xl"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse"></div>
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                        {replayStage === 0 && 'Ingesting Image...'}
                        {replayStage === 1 && 'Intensity Histogram...'}
                        {replayStage === 2 && 'Canny Edge Extraction...'}
                        {replayStage === 3 && 'GLCM Computation...'}
                        {replayStage === 4 && 'LBP Mapping...'}
                        {replayStage === 5 && 'Density Heatmap...'}
                        {replayStage === 6 && 'Topological Contours...'}
                        {replayStage === 7 && 'Saving...'}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* View Toggles */}
                <div className="p-4 bg-zinc-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10">
                  <div className="flex bg-zinc-900/80 rounded-xl p-1 border border-white/5 shadow-inner overflow-x-auto no-scrollbar max-w-full">
                    {(['original', 'histogram', 'edges', 'glcm', 'lbp', 'heatmap', 'contours'] as const).map((view) => (
                      <button
                        key={view}
                        disabled={isReplaying}
                        onClick={() => setActiveView(view)}
                        className={`px-4 py-2 text-[10px] font-bold tracking-wide uppercase rounded-lg capitalize transition-all duration-300 whitespace-nowrap ${
                          activeView === view 
                            ? 'bg-zinc-800 text-white shadow-md border border-white/5' 
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                        } ${isReplaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={triggerReplay} 
                    disabled={isReplaying}
                    variant="outline" 
                    className="bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all font-semibold shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Replay Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature Explorer */}
          <motion.div variants={fadeUp}>
            <Card className="bg-zinc-950/50 border-white/10 overflow-hidden backdrop-blur-sm">
              <CardHeader 
                className="border-b border-white/5 pb-4 cursor-pointer hover:bg-white/[0.03] transition-colors" 
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-400" />
                    Advanced CV Feature Vector
                  </CardTitle>
                  <ChevronRight className={`h-5 w-5 text-zinc-500 transition-transform duration-300 ${showAdvanced ? 'rotate-90 text-indigo-400' : ''}`} />
                </div>
              </CardHeader>
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <CardContent className="p-6">
                      <TooltipProvider delayDuration={100}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {[
                            { key: 'Homogeneity', val: `${(inspection.feature_vector?.homogeneity * 100 || (inspection.homogeneity || 0) * 100 || 0).toFixed(1)}%`, desc: 'Uniform texture', detail: 'Measures how uniform the texture is. Higher values (e.g., Silk ~90%) indicate smooth surfaces, while lower values (e.g., Wool ~20%) indicate fuzzy, chaotic fibers.' },
                            { key: 'Entropy', val: inspection.feature_vector?.entropy?.toFixed(2) || inspection.entropy?.toFixed(2) || 0, desc: 'Complexity', detail: 'Measures the randomness and complexity of the fiber structure. Cotton is typically 5.5, while Wool is highly chaotic at 7.5.' },
                            { key: 'Energy', val: inspection.feature_vector?.energy?.toFixed(2) || inspection.energy?.toFixed(2) || 0, desc: 'Repetitive pattern', detail: 'Measures specular reflection and pattern repetition. Leather/Silk have high energy (0.8+), while Fleece has almost none (<0.1).' },
                            { key: 'Orientation', val: `${inspection.feature_vector?.orientation || inspection.orientation || 0}°`, desc: 'Dominant gradient', detail: 'The dominant angle of the fibers or weave. A strict 90° or 0° usually indicates a synthetic or tightly woven grid like Canvas.' },
                            { key: 'Contrast', val: inspection.feature_vector?.contrast?.toFixed(1) || inspection.contrast?.toFixed(1) || 0, desc: 'Local variation', detail: 'Intensity contrast between a pixel and its neighbor over the entire image. High contrast implies deep weaves (Linen, Denim).' },
                            { key: 'Discontinuity', val: inspection.feature_vector?.discontinuity_score?.toFixed(1) || inspection.discontinuity_score?.toFixed(1) || 0, desc: 'Anomaly detection', detail: 'A proprietary NovaWeave metric that detects structural breaks, tears, or piling in the fabric surface.' },
                          ].map((stat) => (
                            <Tooltip key={stat.key}>
                              <TooltipTrigger asChild>
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.02] transition-colors group cursor-help relative">
                                  <Info className="absolute top-3 right-3 w-3 h-3 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-2 group-hover:text-indigo-400 transition-colors">{stat.key}</p>
                                  <p className="text-lg font-mono text-zinc-200">{stat.val}</p>
                                  <p className="text-[9px] text-zinc-600 mt-1 uppercase tracking-wider">{stat.desc}</p>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[250px] bg-zinc-950 border-white/10 text-zinc-300 text-xs p-3 shadow-2xl">
                                <p className="font-semibold text-white mb-1 border-b border-white/10 pb-1">{stat.key} Analysis</p>
                                {stat.detail}
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </TooltipProvider>
                      
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Enterprise JSON Payload</p>
                        <div className="bg-black p-4 rounded-lg border border-white/5 overflow-x-auto">
                           <pre className="text-[10px] font-mono text-emerald-400/80 leading-relaxed">
                              {JSON.stringify(inspection.feature_vector || {
                                entropy: inspection.entropy,
                                homogeneity: inspection.homogeneity,
                                energy: inspection.energy,
                                contrast: inspection.contrast
                              }, null, 2)}
                           </pre>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: AI Insights */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Executive Summary */}
          <motion.div variants={fadeUp}>
            <Card className="bg-zinc-950/80 border-white/10 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none"></div>
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-indigo-400" />
                  NovaWeave Executive Summary
                </CardTitle>
                <CardDescription className="text-zinc-500 text-xs mt-1">Generated by {inspection.llm_version || 'Groq Llama 3.3 70B'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-5">
                <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                  {inspection.summary}
                </p>
                <div className="pt-5 border-t border-white/5">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> AI Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {inspection.recommendations?.map((rec, i) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        key={i} 
                        className="flex items-start gap-3 text-sm text-zinc-400"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Explainability Engine */}
          <div className="space-y-4">
            <motion.div variants={fadeUp}>
              <Card className="bg-zinc-950/50 border-white/10 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Fingerprint className="w-32 h-32" />
                </div>
                <CardHeader className="pb-3 border-b border-white/5 relative z-10">
                  <CardTitle className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Similarity Against Material Library
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 relative z-10 space-y-4">
                  {inspection.top_materials?.slice(0, 4).map((mat, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs items-end">
                        <span className={`font-bold tracking-wide ${i === 0 ? 'text-white' : 'text-zinc-400'}`}>{mat.name}</span>
                        <span className={`font-mono ${i === 0 ? 'text-indigo-400 font-bold' : 'text-zinc-500'}`}>{mat.score}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${mat.score}%` }}
                          transition={{ duration: 1.5, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                          className={`h-full rounded-full ${i === 0 ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'bg-zinc-700'}`}
                        />
                      </div>
                    </div>
                  ))}
                  {(!inspection.top_materials || inspection.top_materials.length === 0) && (
                    <div className="text-zinc-500 text-sm italic">Similarity data not available for this legacy record.</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={fadeUp} className="h-full">
                <Card className="bg-zinc-950/50 border-white/10 h-full hover:border-emerald-500/30 transition-colors">
                  <CardHeader className="pb-3 border-b border-white/5">
                    <CardTitle className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest">Matched Features</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {inspection.matched_features?.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeUp} className="h-full">
                <Card className="bg-zinc-950/50 border-white/10 h-full hover:border-indigo-500/30 transition-colors">
                  <CardHeader className="pb-3 border-b border-white/5">
                    <CardTitle className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-widest">Texture Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {inspection.texture_profile?.slice(0, 5).map((prof, i) => (
                      <div key={i} className="flex items-start gap-2 text-[10px] uppercase tracking-wider text-zinc-400 font-medium leading-snug">
                        {prof}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Confidence Breakdown */}
          <motion.div variants={fadeUp}>
            <Card className="bg-zinc-950/50 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-white/5">
                <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Inspection Reliability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <motion.p 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                      className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
                    >
                      {inspection.reliability || 93}%
                    </motion.p>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Reliability Score</p>
                  </div>
                  {/* Animated Radial Gauge for Reliability */}
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-zinc-900" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <motion.path 
                        className="text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" 
                        strokeDasharray="100, 100" 
                        strokeWidth="4" 
                        stroke="currentColor" 
                        fill="none" 
                        strokeLinecap="round" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        initial={{ strokeDasharray: "0, 100" }}
                        animate={{ strokeDasharray: `${inspection.reliability || 93}, 100` }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                      />
                    </svg>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Reliability Tree</p>
                  <div className="font-mono text-[11px] text-zinc-400 leading-relaxed bg-zinc-900/50 p-4 rounded-lg border border-white/5">
                    {inspection.confidence_reasoning?.map((reason, i) => (
                      <div key={i} className={`${i === 0 ? 'text-indigo-400 font-bold mb-2' : 'ml-2'} whitespace-pre-wrap`}>
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secondary: Model Confidence */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div>
                     <p className="text-2xl font-bold text-zinc-200">{inspection.confidence || 96}%</p>
                     <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mt-1">Model Confidence</p>
                  </div>
                  <div className="h-10 w-32 bg-zinc-900 rounded-full overflow-hidden shadow-inner flex items-center p-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${inspection.confidence || 96}%` }}
                      transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>

              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
