'use client';

import { Bell, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Topbar() {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center gap-4">
          {/* Engine Status */}
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-emerald-400 tracking-wider uppercase">Engine Ready</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-xs font-medium text-zinc-400">NovaWeave v3.2.1</span>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-xs font-medium text-zinc-500">Groq Llama-3.3</span>
          </div>
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </Button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative">
            <Button variant="ghost" className="flex items-center p-1.5 gap-2 hover:bg-white/5 rounded-full">
              <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <User className="h-4 w-4 text-indigo-300" />
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-2 text-sm font-medium leading-6 text-zinc-300" aria-hidden="true">
                  Quality Inspector
                </span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
