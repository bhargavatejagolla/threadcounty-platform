'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { motion } from 'framer-motion';
import { Network, Cpu, ShieldCheck, Database, Target, Eye, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Background */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] pointer-events-none rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full"></div>

      <main className="flex-grow pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto space-y-32">
          
          {/* Header & Story */}
          <section className="text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-zinc-300"
            >
              <Network className="h-4 w-4 text-indigo-400" /> Our Story
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight"
            >
              Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">future</span> of textile intelligence.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed"
            >
              ThreadCounty was founded by a team of computer vision researchers and textile engineers who were frustrated by the slow, manual, and subjective nature of fabric quality control. We built NovaWeave to bring deterministic, mathematically defensible AI to the manufacturing floor.
            </motion.p>
          </section>

          {/* Mission & Vision */}
          <section className="grid md:grid-cols-2 gap-8">
            <SpotlightCard className="bg-zinc-950/60 border border-white/5 p-10 rounded-[2rem]" spotlightColor="rgba(99,102,241,0.15)">
              <Target className="h-10 w-10 text-indigo-400 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                To automate and democratize textile inspection. We believe that every manufacturer, regardless of size, deserves access to world-class quality control powered by artificial intelligence.
              </p>
            </SpotlightCard>
            <SpotlightCard className="bg-zinc-950/60 border border-white/5 p-10 rounded-[2rem]" spotlightColor="rgba(34,211,238,0.15)">
              <Eye className="h-10 w-10 text-cyan-400 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                A world where fabric defects are caught in milliseconds, waste is eliminated from the supply chain, and textile engineering is driven by absolute, immutable data.
              </p>
            </SpotlightCard>
          </section>

          {/* Technology Stack */}
          <section>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Powered by modern tech</h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">The NovaWeave platform is built on a scalable, edge-ready architecture designed for speed and reliability.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Cpu />, name: "NovaWeave Vision", desc: "OpenCV & GLCM Feature Extraction" },
                { icon: <Database />, name: "Supabase Vault", desc: "PostgreSQL & Vector Storage" },
                { icon: <Network />, name: "React Query", desc: "Global State & Event Bus" },
                { icon: <ShieldCheck />, name: "Groq Llama-3.3", desc: "LLM Explainability Engine" }
              ].map((tech, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center hover:bg-white/[0.04] transition-colors">
                  <div className="w-12 h-12 mx-auto bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
                    {tech.icon}
                  </div>
                  <h3 className="font-bold text-white mb-1">{tech.name}</h3>
                  <p className="text-xs text-zinc-500">{tech.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section>
            <h2 className="text-3xl font-bold mb-12 text-center">Our Journey</h2>
            <div className="relative border-l border-white/10 ml-4 md:mx-auto md:w-full max-w-3xl">
              {[
                { year: "2024", title: "The Concept", desc: "Initial research into applying GLCM and FFT to textile surfaces." },
                { year: "2025", title: "NovaWeave Core", desc: "Launch of the deterministic similarity engine for material classification." },
                { year: "2026", title: "Enterprise V5", desc: "Full release of the ThreadCounty platform with real-time global state and LLM explainability." }
              ].map((item, i) => (
                <div key={i} className="mb-10 ml-8 relative">
                  <div className="absolute -left-[41px] top-1 h-4 w-4 rounded-full bg-indigo-500 ring-4 ring-black"></div>
                  <span className="text-sm font-bold text-indigo-400 tracking-widest">{item.year}</span>
                  <h3 className="text-xl font-bold mt-1 text-white">{item.title}</h3>
                  <p className="text-zinc-400 mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6">
                <Users className="h-8 w-8 text-zinc-400" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Meet the Team</h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">The engineers and researchers behind the NovaWeave Engine.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Dr. Sarah Chen", role: "Chief AI Scientist", img: "https://i.pravatar.cc/150?u=1" },
                { name: "Marcus Johnson", role: "Lead UI Architect", img: "https://i.pravatar.cc/150?u=2" },
                { name: "Elena Rodriguez", role: "Textile Engineer", img: "https://i.pravatar.cc/150?u=3" }
              ].map((member, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full border-4 border-zinc-900 shadow-xl mb-4 grayscale hover:grayscale-0 transition-all duration-500" />
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-indigo-400 text-sm font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
