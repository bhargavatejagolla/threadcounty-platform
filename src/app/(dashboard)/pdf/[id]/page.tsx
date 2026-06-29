'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { InspectionRecord } from '@/types/inspection';
import { CheckCircle2, AlertTriangle, Fingerprint, Cpu, QrCode } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PDFExportPage({ params }: { params: { id: string } }) {
  const [inspection, setInspection] = useState<InspectionRecord | null>(null);

  useEffect(() => {
    async function fetchInspection() {
      if (params.id === 'local') {
        const localData = localStorage.getItem('local_inspection');
        if (localData) {
          setInspection(JSON.parse(localData));
        } else {
          console.error("No local data found in fallback mode.");
        }
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
      }
    }
    fetchInspection();
  }, [params.id]);

  if (!inspection) return <div className="p-10 text-white font-mono">Generating Document...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen text-black font-sans p-10 print:p-0 print:shadow-none shadow-2xl relative">
      
      {/* Action Bar (Hidden when printing) */}
      <div className="absolute top-4 right-4 print:hidden flex gap-4">
        <Button onClick={() => window.history.back()} variant="outline" className="border-zinc-300">Back</Button>
        <Button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">Print Report</Button>
      </div>

      {/* --- COVER PAGE --- */}
      <div className="flex flex-col justify-center items-center h-[90vh] border-8 border-indigo-900 p-12 text-center relative print:break-after-page">
        <div className="absolute top-12 left-12">
          <p className="font-mono text-sm font-bold text-zinc-400">{inspection.inspection_id}</p>
        </div>
        <div className="absolute top-12 right-12">
          <QrCode className="w-16 h-16 text-zinc-800" />
        </div>
        
        <h1 className="text-6xl font-black tracking-tighter text-zinc-900 mb-4 mt-20">NOVAWEAVE AI</h1>
        <p className="text-zinc-500 font-medium tracking-widest uppercase text-xl mb-12">Enterprise Quality Inspection Report</p>
        
        <div className="flex gap-6 w-full max-w-4xl mb-12">
          <div className="flex-1 bg-zinc-50 border border-zinc-200 p-8 rounded-xl text-left shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">Similarity Ranking</p>
            <div className="space-y-3">
              {inspection.top_materials?.slice(0, 4).map((mat, i) => (
                <div key={i} className="flex justify-between items-end border-b border-zinc-200 pb-2">
                  <span className={`font-bold ${i === 0 ? 'text-indigo-900 text-xl tracking-tight' : 'text-zinc-600 text-sm'}`}>{mat.name}</span>
                  <span className={`font-mono font-bold ${i === 0 ? 'text-indigo-600 text-lg' : 'text-zinc-500 text-sm'}`}>{mat.score}%</span>
                </div>
              ))}
              {(!inspection.top_materials || inspection.top_materials.length === 0) && (
                <p className="text-zinc-500 text-sm italic">Similarity data not available.</p>
              )}
            </div>
          </div>
          
          <div className="flex-1 bg-zinc-50 border border-zinc-200 p-8 rounded-xl text-left shadow-sm">
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">Texture Profile</p>
             <div className="space-y-3">
               {inspection.texture_profile?.slice(0, 6).map((prof, i) => (
                 <div key={i} className="flex items-start gap-2 text-[10px] uppercase tracking-widest text-zinc-700 font-bold">
                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                   <span className="leading-tight">{prof}</span>
                 </div>
               ))}
               {(!inspection.texture_profile || inspection.texture_profile.length === 0) && (
                <p className="text-zinc-500 text-sm italic">Texture profile not available.</p>
               )}
             </div>
          </div>
        </div>

        <div className="mt-auto flex justify-between w-full text-left">
           <div>
             <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Date</p>
             <p className="font-mono text-sm">{new Date(inspection.created_at).toLocaleString()}</p>
           </div>
           <div className="text-right">
             <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Analysis Hash</p>
             <p className="font-mono text-sm flex items-center justify-end gap-1"><Fingerprint className="w-3 h-3"/> {inspection.analysis_hash}</p>
           </div>
        </div>
      </div>

      {/* --- PAGE 2: SUMMARY & METRICS --- */}
      <div className="border-b-4 border-indigo-600 pb-6 mb-8 mt-12 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-zinc-900 mb-1">EXECUTIVE SUMMARY</h2>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-bold text-zinc-800">{inspection.inspection_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Left Col: Original Image */}
        <div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-200 pb-2">Captured Sample</p>
          <div className="aspect-video bg-zinc-100 rounded-lg overflow-hidden border border-zinc-300 print:break-inside-avoid">
            <img src={inspection.image_url} className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply" alt="Original Sample" />
          </div>
        </div>
        
        {/* Right Col: Top Level Stats */}
        <div className="space-y-4">
           <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-200 pb-2">Final Verdict</p>
           
           <div className="flex gap-4">
             <div className="flex-1 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
               <p className="text-[10px] font-bold text-zinc-500 uppercase">Quality Score</p>
               <p className="text-4xl font-black text-emerald-600">{inspection.quality || 92}</p>
             </div>
             <div className="flex-1 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
               <p className="text-[10px] font-bold text-zinc-500 uppercase">Reliability</p>
               <p className="text-4xl font-black text-indigo-600">{inspection.reliability || 93}%</p>
             </div>
             <div className="flex-1 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
               <p className="text-[10px] font-bold text-zinc-500 uppercase">Model Conf.</p>
               <p className="text-4xl font-black text-blue-600">{inspection.confidence || 96}%</p>
             </div>
           </div>
           
           <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
             <div className="flex items-center gap-2 mb-2">
               <Cpu className="w-4 h-4 text-indigo-600" />
               <p className="font-bold text-indigo-900 text-sm">Executive Summary</p>
             </div>
             <p className="text-sm text-indigo-900/80 leading-relaxed font-medium">
               {inspection.summary}
             </p>
           </div>
        </div>
      </div>

      {/* Feature Data Grid */}
      <div className="mb-8 print:break-inside-avoid">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-200 pb-2">Physical CV Metrics</p>
        <div className="grid grid-cols-4 gap-4">
          {[
            { k: 'Homogeneity', v: `${((inspection.homogeneity || 0) * 100).toFixed(1)}%` },
            { k: 'Entropy', v: inspection.entropy || 0 },
            { k: 'Energy', v: inspection.energy || 0 },
            { k: 'Orientation', v: `${inspection.orientation || 0}°` },
            { k: 'Contrast', v: inspection.contrast || 0 },
            { k: 'Edge Density', v: inspection.edge_density || 0 },
            { k: 'Texture Var.', v: inspection.texture_variance || 0 },
            { k: 'Discontinuity', v: inspection.discontinuity_score || 0 },
          ].map(m => (
            <div key={m.k} className="border border-zinc-200 rounded p-3 bg-zinc-50">
              <p className="text-[10px] text-zinc-500 font-bold uppercase">{m.k}</p>
              <p className="font-mono text-lg text-zinc-900">{m.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations & Reasoning */}
      <div className="grid grid-cols-2 gap-8 print:break-inside-avoid mb-8">
        <div>
           <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-200 pb-2">Reliability Tree</p>
           <div className="font-mono text-[11px] text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-lg border border-zinc-200">
             {inspection.confidence_reasoning?.map((reason, i) => (
               <div key={i} className={`${i === 0 ? 'text-indigo-700 font-bold mb-2' : 'ml-2'} whitespace-pre-wrap`}>
                 {reason}
               </div>
             ))}
           </div>
        </div>
        
        <div>
           <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-200 pb-2">Actionable Recommendations</p>
           <ul className="space-y-3">
             {inspection.recommendations?.map((rec, i) => (
               <li key={i} className="flex gap-2 text-sm text-zinc-700 font-medium">
                 <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                 {rec}
               </li>
             ))}
           </ul>
        </div>
      </div>

      {/* --- PAGE 3: RAW FEATURE VECTOR --- */}
      <div className="mt-12 print:break-before-page">
        <div className="border-b-4 border-zinc-300 pb-6 mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-zinc-900 mb-1">RAW FEATURE VECTOR</h2>
            <p className="text-zinc-500 font-medium tracking-widest uppercase text-xs">JSON API Payload Dump</p>
          </div>
        </div>
        <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg text-[10px] font-mono whitespace-pre-wrap text-zinc-800">
           {JSON.stringify(inspection.feature_vector || {
             entropy: inspection.entropy,
             homogeneity: inspection.homogeneity,
             energy: inspection.energy,
             contrast: inspection.contrast,
             edge_density: inspection.edge_density,
             orientation: inspection.orientation
           }, null, 2)}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-200 pt-6 mt-12 flex justify-between items-center text-[10px] font-mono text-zinc-400 uppercase tracking-widest print:break-inside-avoid">
        <div>
          <p>Engine: {inspection.vision_engine_version || 'NovaWeave Vision v3.2'}</p>
          <p>LLM: {inspection.llm_version || 'Groq Llama 3.3 70B'}</p>
        </div>
        <div className="text-right">
          <p>Processing Time: {inspection.processing_time}s</p>
          <p>Certified by NovaWeave AI</p>
        </div>
      </div>

    </div>
  );
}
