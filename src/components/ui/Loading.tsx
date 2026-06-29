import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      
      {/* Deep Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="relative flex flex-col items-center justify-center z-10">
        
        {/* The Premium "Filling" Logo Container */}
        <div className="relative w-28 h-32 flex items-center justify-center mb-8">
          
          {/* 1. The Wireframe Base (Empty State) */}
          <svg className="absolute inset-0 w-full h-full text-zinc-800" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5 L95 30 L95 90 L50 115 L5 90 L5 30 Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
            <path d="M50 5 L50 115 M5 30 L95 90 M5 90 L95 30" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />
          </svg>

          {/* 2. The Tracing Glow (Energy moving around the edges) */}
          <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <style>
              {`
                .trace-path {
                  stroke-dasharray: 400;
                  stroke-dashoffset: 400;
                  animation: trace 3s ease-in-out infinite alternate;
                }
                @keyframes trace {
                  0% { stroke-dashoffset: 400; }
                  100% { stroke-dashoffset: 0; }
                }
              `}
            </style>
            <path className="trace-path" d="M50 5 L95 30 L95 90 L50 115 L5 90 L5 30 Z" stroke="url(#electric-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="electric-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* 3. The Liquid Fill (The core filling up) */}
          <div className="absolute inset-0 w-full h-full" style={{ clipPath: 'polygon(50% 5%, 95% 30%, 95% 90%, 50% 115%, 5% 90%, 5% 30%)' }}>
            {/* We use an animated wave translation combined with a vertical fill animation */}
            <div className="absolute inset-0 top-auto bottom-0 w-full overflow-hidden animate-[fill-up_4s_ease-in-out_infinite_alternate]" style={{ height: '0%' }}>
               <style>
                {`
                  @keyframes fill-up {
                    0% { height: 0%; opacity: 0.2; }
                    20% { opacity: 1; }
                    100% { height: 100%; opacity: 1; }
                  }
                  @keyframes wave-shift {
                    0% { transform: translateX(0) scaleY(1); }
                    50% { transform: translateX(-25%) scaleY(1.2); }
                    100% { transform: translateX(-50%) scaleY(1); }
                  }
                `}
               </style>
               {/* The wave itself */}
               <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-t from-indigo-600 via-cyan-500/80 to-indigo-400/50 backdrop-blur-md animate-[wave-shift_3s_linear_infinite]" style={{
                 maskImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10 Q 50 20, 100 10 T 200 10 L200 20 L0 20 Z\' fill=\'black\'/%3E%3C/svg%3E")',
                 maskSize: '50% 100%',
                 maskRepeat: 'repeat-x',
                 WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10 Q 50 0, 100 10 T 200 10 L200 20 L0 20 Z\' fill=\'black\'/%3E%3C/svg%3E")',
                 WebkitMaskSize: '100px 20px',
                 WebkitMaskRepeat: 'repeat-x',
                 WebkitMaskPosition: 'top left'
               }}>
                 {/* Internal glowing elements within the liquid */}
                 <div className="absolute bottom-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
               </div>
               
               {/* Fallback solid fill if mask fails in some browsers */}
               <div className="absolute top-[10px] bottom-0 w-full bg-gradient-to-t from-indigo-600 via-indigo-500/80 to-transparent backdrop-blur-md"></div>
            </div>
          </div>
          
          {/* Inner Weave Motif (NovaWeave's "W" / "N" core that glows intensely when the liquid hits it) */}
          <svg className="absolute inset-0 w-full h-full z-10 mix-blend-overlay drop-shadow-2xl" viewBox="0 0 100 120" fill="none">
             <path d="M 30,35 L 30,85 L 50,60 L 70,85 L 70,35" stroke="white" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          </svg>

        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-black tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] animate-pulse">
            NOVAWEAVE
          </h2>
          <div className="mt-4 flex items-center gap-3">
             <div className="flex gap-1">
               <div className="w-1 h-1 rounded-full bg-emerald-400 animate-[ping_1s_ease-in-out_infinite]"></div>
               <div className="w-1 h-1 rounded-full bg-emerald-400 animate-[ping_1.2s_ease-in-out_infinite_0.2s]"></div>
               <div className="w-1 h-1 rounded-full bg-emerald-400 animate-[ping_1.4s_ease-in-out_infinite_0.4s]"></div>
             </div>
             <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold opacity-80">
               Neural Engine Initializing
             </p>
          </div>
          <div className="mt-2 text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-mono">
            Compiling Compute Shaders...
          </div>
        </div>

      </div>
    </div>
  );
}
