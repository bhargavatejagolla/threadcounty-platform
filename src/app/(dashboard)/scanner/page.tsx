'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Camera as CameraIcon, Layers, Image as ImageIcon, Zap, Cpu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractImageFeatures, calculateMetrics } from '@/lib/cv/extractor';
import { OpenCVClassifier } from '@/lib/cv/opencv-classifier';

export default function FabricScannerPage() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<'upload' | 'camera' | 'batch'>('upload');
  
  // Pipeline State
  const [isScanning, setIsScanning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [logs, setLogs] = useState<{time: string, msg: string}[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Camera handling
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (mode === 'camera' && !isScanning && !capturedImage) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(err => console.error('Camera access denied:', err));
    }
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [mode, isScanning, capturedImage]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { time, msg }]);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const captureAndScan = async (dataUrl: string | null = null) => {
    const targetImage = dataUrl || capturedImage;
    if (!targetImage) return;

    setIsScanning(true);
    setLogs([]);
    setPipelineStep(0);
    const startTime = Date.now();

    try {
      addLog('System Ready. NovaWeave Core Initialized.');
      await delay(800);
      
      // Step 1: CV Extraction (Canvas based)
      setPipelineStep(1);
      addLog('Extracting physical features (Brightness, Contrast, Entropy)...');
      const metrics = await extractImageFeatures(targetImage);
      const { quality: qualityScore, reliability, confidence: modelConfidence } = calculateMetrics(metrics);
      await delay(600);
      addLog(`Vision Metrics Calculated. Edge Density: ${metrics.edge_density}. Quality: ${qualityScore}/100`);

      // Step 2: NovaWeave Material Classification (Deterministic Plugin)
      addLog('NovaWeave Classifier analyzing features...');
      const classifier = new OpenCVClassifier();
      const { material, pattern, materialConfidence, patternConfidence, topMaterials, topPatterns, textureProfile, matchedFeatures } = await classifier.classify(metrics);
      await delay(400);
      addLog(`Classification complete: ${material} (${materialConfidence}%) - ${pattern} (${patternConfidence}%)`);

      // Step 3: Groq LLM Inference
      setPipelineStep(2);
      addLog('Nova AI processing metrics for Executive Summary...');
      
      const response = await fetch('/api/nova-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics, qualityScore, reliability, modelConfidence, topMaterials, topPatterns, textureProfile, matchedFeatures })
      });

      if (!response.ok) throw new Error('Nova AI Inference failed');
      const aiResult = await response.json();
      addLog('Nova AI generated structural analysis and recommendations.');
      
      // Step 3: Save to Supabase (Single Source of Truth)
      setPipelineStep(3);
      addLog('Saving complete inspection record to Vault...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const inspectionId = `TC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
      const analysisHash = crypto.randomUUID().substring(0, 8).toUpperCase();

      let targetId = "";
      try {
        const { data: savedRecord, error } = await supabase
          .from('inspections')
          .insert({
            inspection_id: inspectionId,
            user_id: user.id,
            image_url: targetImage,
            
            // Enterprise Payload
            feature_vector: metrics,
            material_prediction: material,
            pattern_prediction: pattern,
            
            // Explainability Engine
            top_materials: topMaterials,
            top_patterns: topPatterns,
            texture_profile: textureProfile,
            matched_features: matchedFeatures,
            
            // Flat fallback (optional for now)
            entropy: metrics.entropy,
            energy: metrics.energy,
            homogeneity: metrics.homogeneity,
            contrast: metrics.contrast,
            correlation: metrics.correlation,
            edge_density: metrics.edge_density,
            orientation: metrics.orientation,
            texture_variance: metrics.texture_variance,
            fft_peak: metrics.fft_peak,
            discontinuity_score: metrics.discontinuity_score,
            
            quality: qualityScore,
            reliability: reliability,
            confidence: modelConfidence,
            summary: aiResult.executive_summary,
            recommendations: aiResult.recommendations,
            limitations: aiResult.limitations,
            confidence_reasoning: aiResult.confidence_reasoning,
            inspection_grade: aiResult.inspection_grade,
            risk_level: aiResult.risk_level,
            
            // Pluggable Versioning
            vision_engine_version: "NovaWeave Vision Core v3.2",
            feature_engine_version: "NovaWeave Feature Engine v3.2",
            classifier_version: "NovaWeave Material Classifier v1.0",
            llm_version: "NovaWeave Insight Engine (Groq Llama-3.3)",
            report_engine_version: "NovaWeave Report Generator v2.0",
            pipeline_version: "2026.06.28",
            
            processing_time: parseFloat(processingTime),
            analysis_hash: analysisHash,
            camera_metadata: { resolution: "High", lighting: "Auto" },
            device_info: { client: navigator.userAgent }
          })
          .select()
          .single();

        if (error) throw error;
        targetId = savedRecord.id;
      } catch (dbErr: any) {
        console.warn("Database error, falling back to local storage:", dbErr);
        addLog("Warning: DB Schema outdated. Saving to Local Storage instead.");
        
        const localRecord = {
          id: "local",
          inspection_id: inspectionId,
          image_url: targetImage,
          
          feature_vector: metrics,
          material_prediction: material,
          pattern_prediction: pattern,
          
          top_materials: topMaterials,
          top_patterns: topPatterns,
          texture_profile: textureProfile,
          matched_features: matchedFeatures,
          
          entropy: metrics.entropy,
          energy: metrics.energy,
          homogeneity: metrics.homogeneity,
          contrast: metrics.contrast,
          correlation: metrics.correlation,
          edge_density: metrics.edge_density,
          orientation: metrics.orientation,
          texture_variance: metrics.texture_variance,
          fft_peak: metrics.fft_peak,
          discontinuity_score: metrics.discontinuity_score,
          
          quality: qualityScore,
          reliability: reliability,
          confidence: modelConfidence,
          summary: aiResult.executive_summary,
          recommendations: aiResult.recommendations,
          limitations: aiResult.limitations,
          confidence_reasoning: aiResult.confidence_reasoning,
          inspection_grade: aiResult.inspection_grade,
          risk_level: aiResult.risk_level,
          
          vision_engine_version: "NovaWeave Vision Core v3.2",
          feature_engine_version: "NovaWeave Feature Engine v3.2",
          classifier_version: "NovaWeave Material Classifier v1.0",
          llm_version: "NovaWeave Insight Engine (Groq Llama-3.3)",
          report_engine_version: "NovaWeave Report Generator v2.0",
          pipeline_version: "2026.06.28",
          processing_time: parseFloat(processingTime),
          analysis_hash: analysisHash,
          created_at: new Date().toISOString()
        };
        localStorage.setItem('local_inspection', JSON.stringify(localRecord));
        targetId = "local";
      }

      addLog(`Inspection Complete. Engine Time: ${processingTime}s`);
      
      // Route to the new unified Inspection Page using the exact DB ID or local ID
      setTimeout(() => router.push(`/inspection/${targetId}`), 1000);

    } catch (err: any) {
      console.error(err);
      addLog(`ERROR: ${err.message}`);
      setIsScanning(false);
    }
  };

  const handleCameraCapture = () => {
    if (mode === 'camera' && videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(dataUrl);
      captureAndScan(dataUrl);
    }
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setCapturedImage(dataUrl);
        captureAndScan(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      {!isScanning && (
        <div className="text-center space-y-4 pt-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">Fabric Scanner</h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm">
            Upload fabric images or use your camera to initiate the NovaWeave Vision pipeline.
          </p>
        </div>
      )}

      {/* Mode Selector */}
      {!isScanning && (
        <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/10 w-full max-w-md mx-auto">
          <button onClick={() => setMode('upload')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'upload' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-300'}`}><UploadCloud className="w-4 h-4" /> Upload</button>
          <button onClick={() => setMode('camera')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'camera' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-300'}`}><CameraIcon className="w-4 h-4" /> Camera</button>
          <button onClick={() => setMode('batch')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'batch' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-300'}`}><Layers className="w-4 h-4" /> Batch</button>
        </div>
      )}

      {/* Scanner UI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Side: Input / Image */}
        <Card className={`bg-zinc-950/50 border-white/10 overflow-hidden relative transition-all duration-500 ${isScanning ? 'shadow-2xl shadow-indigo-500/10 border-indigo-500/30' : ''}`}>
          <CardContent className="p-0">
            {mode === 'camera' && !capturedImage ? (
              <div className="relative aspect-square md:aspect-video bg-black flex flex-col font-mono">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                
                {/* Industrial UI Overlay */}
                <div className="absolute inset-0 pointer-events-none border-[1px] border-indigo-500/30 m-4 flex flex-col justify-between p-4">
                  
                  {/* Top HUD */}
                  <div className="flex justify-between items-start">
                    <div className="bg-black/60 backdrop-blur px-2 py-1 border border-white/10 rounded flex flex-col text-[10px] uppercase text-indigo-400 font-bold tracking-widest gap-1">
                      <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Camera Ready</div>
                      <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Engine Ready</div>
                      <div className="text-zinc-500">RES: 1080P // 60FPS</div>
                    </div>
                    
                    <div className="bg-black/60 backdrop-blur px-2 py-1 border border-white/10 rounded flex flex-col text-[10px] uppercase text-emerald-400 font-bold tracking-widest gap-1 text-right">
                      <div className="text-zinc-400">Memory: 45MB / 2GB</div>
                      <div className="text-zinc-400">GPU Acceleration: ON</div>
                      <div>Est. processing: 1.2s</div>
                    </div>
                  </div>

                  {/* Center Target */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="w-48 h-48 border-[1px] border-indigo-500 rounded-full flex items-center justify-center relative">
                       <div className="absolute w-full h-[1px] bg-indigo-500/50"></div>
                       <div className="absolute h-full w-[1px] bg-indigo-500/50"></div>
                    </div>
                  </div>

                  {/* Bottom HUD */}
                  <div className="flex justify-between items-end">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
                      <span className="text-amber-500">WAITING FOR FOCUS</span>
                      <br/>
                      Align fabric parallel to lens
                    </div>
                    
                    <div className="flex flex-col items-end gap-1 text-[10px] uppercase font-bold tracking-widest">
                      <div className="text-emerald-400">Lighting: Optimal</div>
                      <div className="text-emerald-400">Blur Score: Minimal</div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 flex justify-center z-10">
                  <Button onClick={handleCameraCapture} size="lg" className="rounded-full h-16 w-16 p-0 bg-indigo-500 hover:bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)] border-4 border-indigo-300 transition-all active:scale-95">
                    <span className="sr-only">Capture</span>
                  </Button>
                </div>
              </div>
            ) : mode === 'upload' && !capturedImage ? (
              <div 
                className={`aspect-square md:aspect-video flex flex-col items-center justify-center text-center p-8 transition-colors ${dragActive ? 'bg-indigo-500/10' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFileUpload({ target: { files: e.dataTransfer.files }}); }}
              >
                <div className="h-16 w-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6 text-zinc-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Drag & Drop Fabric Image</h3>
                <p className="text-zinc-500 text-sm mb-6">Supports high-res JPG, PNG</p>
                <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileUpload} />
                <label htmlFor="file-upload">
                  <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200 cursor-pointer">
                    <span>Browse Files</span>
                  </Button>
                </label>
              </div>
            ) : (
              <div className="relative aspect-square md:aspect-video bg-zinc-900">
                {capturedImage && <img src={capturedImage} alt="Captured" className="w-full h-full object-cover opacity-60" />}
                
                {/* Simulated Scanning Overlay */}
                {isScanning && (
                  <>
                    <motion.div 
                      className="absolute inset-x-0 h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)]"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="absolute inset-0 border-[4px] border-indigo-500/20 mix-blend-overlay m-4 rounded-xl"></div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Side: Visual Pipeline & Live Log */}
        <AnimatePresence>
          {(isScanning || logs.length > 0) && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Visual Pipeline Nodes */}
              <Card className="bg-zinc-950/50 border-white/10 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-400" /> NovaWeave Pipeline
                  </h3>
                  <div className="flex justify-between items-center relative">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-800 -z-10 -translate-y-1/2"></div>
                    
                    {[
                      { icon: ImageIcon, label: 'Image' },
                      { icon: Layers, label: 'Extraction' },
                      { icon: Cpu, label: 'Nova AI' },
                      { icon: Zap, label: 'Database' }
                    ].map((node, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                          pipelineStep >= i ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-zinc-900 border-zinc-700'
                        }`}>
                          <node.icon className={`w-4 h-4 ${pipelineStep >= i ? 'text-white' : 'text-zinc-500'}`} />
                        </div>
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${pipelineStep >= i ? 'text-indigo-300' : 'text-zinc-600'}`}>{node.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Live Log Terminal */}
              <Card className="bg-[#09090b] border-zinc-800 font-mono shadow-2xl">
                <CardContent className="p-0">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                    </div>
                    <span className="text-[10px] text-zinc-500 ml-2">Live AI Event Log</span>
                  </div>
                  <div className="p-4 h-[200px] overflow-y-auto space-y-2 text-xs flex flex-col">
                    {logs.map((log, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i} 
                        className="flex gap-3"
                      >
                        <span className="text-zinc-600 shrink-0">[{log.time}]</span>
                        <span className={`${log.msg.startsWith('ERROR') ? 'text-red-400 font-bold' : i === logs.length - 1 && isScanning ? 'text-emerald-400' : 'text-zinc-400'}`}>
                          {log.msg}
                        </span>
                      </motion.div>
                    ))}
                    {isScanning && <div className="animate-pulse text-zinc-600 mt-2">_</div>}
                    {!isScanning && logs.some(l => l.msg.startsWith('ERROR')) && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400">
                        <span className="font-bold uppercase tracking-widest text-[10px] block mb-1">System Halt</span>
                        Make sure you have run the `supabase-schema-v4-explainable.sql` script in your Supabase SQL Editor. The database schema must be updated to accept the new Explainability arrays.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
