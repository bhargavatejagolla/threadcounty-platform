import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-2xl">
      <div className="relative flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
        {/* Deep Glowing Background Blur */}
        <div className="absolute inset-0 -z-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-[80px] animate-pulse" />
        
        {/* High-Tech Orbiting Rings */}
        <div className="absolute h-36 w-36 animate-[spin_3s_linear_infinite] rounded-full border-b-2 border-r-2 border-indigo-500/50" />
        <div className="absolute h-40 w-40 animate-[spin_4s_linear_infinite_reverse] rounded-full border-t-2 border-l-2 border-cyan-500/40" />
        
        {/* Core Glassmorphic Logo Container */}
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-950/60 glass shadow-[0_0_40px_rgba(99,102,241,0.3)]">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
        </div>
        
        <h2 className="mt-10 text-xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.6)] animate-pulse">
          NOVAWEAVE
        </h2>
        <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground/80 font-medium">
          Loading Neural Engine...
        </p>
      </div>
    </div>
  );
}
