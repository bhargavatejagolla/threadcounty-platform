'use client';

import Link from 'next/link';
import { Search, MessageCircle, Globe, Share2, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10 px-6 relative overflow-hidden z-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                <Search className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-100 transition-colors">
                NovaWeave
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Automated textile inspection powered by deep learning. The definitive operating system for modern fabric analysis.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-6 tracking-wide">Product</h3>
            <ul className="space-y-4">
              <li><Link href="/scanner" className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">Fabric Scanner</Link></li>
              <li><Link href="/vault" className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">Analysis Vault</Link></li>
              <li><Link href="/pricing" className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">Pricing</Link></li>
              <li><a href="#" className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">API Documentation</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-6 tracking-wide">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">Contact</Link></li>
              <li><a href="#" className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-6 tracking-wide">Support</h3>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">FAQ</Link></li>
              <li><a href="#" className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 font-medium tracking-wide">
            &copy; {currentYear} ThreadCounty Inc. All rights reserved. NovaWeave AI™ is a trademark of ThreadCounty.
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
